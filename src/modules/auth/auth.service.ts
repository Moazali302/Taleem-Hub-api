import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import {
  AuthMessages,
  BCRYPT_SALT_ROUNDS,
  JWT_COOKIE_MAX_AGE_HOURS,
  OTP_EXPIRY_MINUTES,
  ROLE_DASHBOARD_PATHS,
  SchoolRoleEnum,
  SchoolStatusEnum,
  SCHOOL_ID_RANDOM_ALPHABET,
  TALEEM_TOKEN_COOKIE,
  type SchoolRoleValue,
} from '../../common/constants/auth.constants';
import { School } from '../../database/entities/school.entity';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TaleemJwtPayload } from './interfaces/jwt-payload.interface';

/**
 * Handles school registration, approval workflow, login with OTP, JWT cookies, and password reset.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new school (admin owner), hashes password, assigns a unique business school ID, and sends notification emails.
   */
  async register(dto: RegisterDto): Promise<{
    success: boolean;
    message: string;
  }> {
    const existing = await this.schoolRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException(AuthMessages.EMAIL_ALREADY_REGISTERED);
    }

    const password_hash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const school_id = await this.generateUniqueBusinessSchoolId(dto.schoolName);

    const school = this.schoolRepository.create({
      school_name: dto.schoolName.trim(),
      owner_name: dto.ownerName.trim(),
      school_address: dto.schoolAddress.trim(),
      phone: dto.phone.trim(),
      email: dto.email.toLowerCase().trim(),
      password_hash,
      school_id,
      role: SchoolRoleEnum.ADMIN,
      status: SchoolStatusEnum.PENDING,
      is_email_verified: false,
      otp: null,
      otp_expires_at: null,
    });

    await this.schoolRepository.save(school);

    const backendBase = this.configService
      .getOrThrow<string>('BACKEND_URL')
      .replace(/\/$/, '');
    const apiPrefix = this.configService.get<string>('API_PREFIX', 'v1');
    const approveUrl = `${backendBase}/${apiPrefix}/auth/approve/${encodeURIComponent(school_id)}`;
    const rejectUrl = `${backendBase}/${apiPrefix}/auth/reject/${encodeURIComponent(school_id)}`;

    const superadminInbox = this.configService.getOrThrow<string>('MAIL_USER');

    await Promise.all([
      this.mailService.sendRegistrationWelcomeEmail({
        to: school.email,
        ownerName: school.owner_name,
        schoolName: school.school_name,
      }),
      this.mailService.sendNewSchoolRegistrationNotificationToSuperadmin({
        to: superadminInbox,
        schoolName: school.school_name,
        ownerName: school.owner_name,
        schoolAddress: school.school_address,
        phone: school.phone,
        email: school.email,
        schoolBusinessId: school.school_id,
        registeredAtIso: school.created_at.toISOString(),
        approveUrl,
        rejectUrl,
      }),
    ]);

    return {
      success: true,
      message: AuthMessages.REGISTRATION_SUCCESS,
    };
  }

  /**
   * Approves a pending school by business school ID, updates verification flags, emails the owner, and returns an HTML confirmation for the superadmin.
   */
  async approveSchool(schoolBusinessId: string): Promise<string> {
    const school = await this.schoolRepository.findOne({
      where: { school_id: schoolBusinessId },
    });
    if (!school) {
      throw new NotFoundException(AuthMessages.SCHOOL_NOT_FOUND);
    }

    if (school.status === SchoolStatusEnum.APPROVED) {
      return this.buildSuperadminActionPage(
        'Status',
        AuthMessages.ALREADY_APPROVED,
      );
    }
    if (school.status === SchoolStatusEnum.REJECTED) {
      return this.buildSuperadminActionPage(
        'Status',
        AuthMessages.ALREADY_REJECTED,
      );
    }

    school.status = SchoolStatusEnum.APPROVED;
    school.is_email_verified = true;
    await this.schoolRepository.save(school);

    const frontend = this.configService
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');
    const loginUrl = `${frontend}/login`;

    await this.mailService.sendSchoolApprovedEmail({
      to: school.email,
      ownerName: school.owner_name,
      schoolName: school.school_name,
      schoolBusinessId: school.school_id,
      loginUrl,
    });

    return this.buildSuperadminActionPage(
      'School Approved Successfully',
      'The school has been approved and the administrator has been notified by email.',
    );
  }

  /**
   * Rejects a school registration, notifies the owner by email, and returns an HTML confirmation for the superadmin.
   */
  async rejectSchool(schoolBusinessId: string): Promise<string> {
    const school = await this.schoolRepository.findOne({
      where: { school_id: schoolBusinessId },
    });
    if (!school) {
      throw new NotFoundException(AuthMessages.SCHOOL_NOT_FOUND);
    }

    school.status = SchoolStatusEnum.REJECTED;
    await this.schoolRepository.save(school);

    await this.mailService.sendSchoolRejectedEmail({
      to: school.email,
      ownerName: school.owner_name,
    });

    return this.buildSuperadminActionPage(
      'School Rejected',
      'The registration has been marked as rejected and the applicant has been notified.',
    );
  }

  /**
   * Authenticates email and password, reuses a valid cookie JWT when possible, otherwise issues a login OTP by email.
   */
  async login(
    dto: LoginDto,
    req: Request,
  ): Promise<
    | {
        success: boolean;
        message: string;
        requiresOtp: true;
      }
    | {
        success: boolean;
        token: string;
        role: SchoolRoleValue;
        redirectTo: string;
      }
  > {
    const email = dto.email.toLowerCase().trim();
    const school = await this.schoolRepository.findOne({ where: { email } });
    if (!school) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const passwordOk = await bcrypt.compare(dto.password, school.password_hash);
    if (!passwordOk) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }
    if (dto.schoolId !== school.school_id) {
      throw new UnauthorizedException(AuthMessages.INVALID_SCHOOL_ID);
    }
    if (school.status === SchoolStatusEnum.PENDING) {
      throw new ForbiddenException(AuthMessages.ACCOUNT_UNDER_REVIEW);
    }
    if (school.status === SchoolStatusEnum.REJECTED) {
      throw new ForbiddenException(AuthMessages.ACCOUNT_REJECTED);
    }

    const cookieToken = req.cookies?.[TALEEM_TOKEN_COOKIE] as
      | string
      | undefined;
    if (cookieToken) {
      try {
        const secret = this.configService.getOrThrow<string>('JWT_SECRET');
        const payload = this.jwtService.verify<TaleemJwtPayload>(cookieToken, {
          secret,
        });
        if (payload.email === email) {
          const redirectTo = this.buildDashboardUrl(school.role);
          return {
            success: true,
            token: cookieToken,
            role: school.role,
            redirectTo,
          };
        }
      } catch {
        /* fall through to OTP flow */
      }
    }

    const otp = this.generateSixDigitOtp();
    const otp_expires_at = this.getOtpExpiryDate();
    school.otp = otp;
    school.otp_expires_at = otp_expires_at;
    await this.schoolRepository.save(school);

    await this.mailService.sendLoginOtpEmail({
      to: school.email,
      ownerName: school.owner_name,
      otp,
    });

    return {
      success: true,
      message: AuthMessages.OTP_SENT,
      requiresOtp: true,
    };
  }

  /**
   * Validates the login OTP, issues a JWT, stores it in an HTTP-only cookie, and returns session metadata for the client.
   */
  async verifyOtp(
    dto: VerifyOtpDto,
    res: Response,
  ): Promise<{
    success: boolean;
    token: string;
    role: SchoolRoleValue;
    redirectTo: string;
    user: {
      name: string;
      email: string;
      schoolId: string;
      role: SchoolRoleValue;
    };
  }> {
    const email = dto.email.toLowerCase().trim();
    const school = await this.schoolRepository.findOne({ where: { email } });
    if (!school) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    if (school.status !== SchoolStatusEnum.APPROVED) {
      if (school.status === SchoolStatusEnum.PENDING) {
        throw new ForbiddenException(AuthMessages.ACCOUNT_UNDER_REVIEW);
      }
      throw new ForbiddenException(AuthMessages.ACCOUNT_REJECTED);
    }

    if (!school.otp || school.otp !== dto.otp) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }
    if (
      !school.otp_expires_at ||
      school.otp_expires_at.getTime() < Date.now()
    ) {
      throw new UnauthorizedException(AuthMessages.OTP_EXPIRED);
    }

    school.otp = null;
    school.otp_expires_at = null;
    await this.schoolRepository.save(school);

    const token = this.signAccessToken(school);
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const maxAgeMs = JWT_COOKIE_MAX_AGE_HOURS * 60 * 60 * 1000;

    res.cookie(TALEEM_TOKEN_COOKIE, token, {
      httpOnly: true,
      maxAge: maxAgeMs,
      sameSite: 'strict',
      secure: isProd,
      path: '/',
    });

    const redirectTo = this.buildDashboardUrl(school.role);

    return {
      success: true,
      token,
      role: school.role,
      redirectTo,
      user: {
        name: school.owner_name,
        email: school.email,
        schoolId: school.school_id,
        role: school.role,
      },
    };
  }
  async resendOtp(
    dto: ResendOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const email = dto.email.toLowerCase().trim();

    const school = await this.schoolRepository.findOne({ where: { email } });
    if (!school) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    const otp = this.generateSixDigitOtp();
    school.otp = otp;
    school.otp_expires_at = this.getOtpExpiryDate(); // ← correct field name
    await this.schoolRepository.save(school);

    await this.mailService.sendLoginOtpEmail({
      // ← correct method name
      to: school.email,
      ownerName: school.owner_name,
      otp,
    });

    return {
      success: true,
      message: AuthMessages.OTP_SENT,
    };
  }
  async verifyResetOtp(dto: VerifyOtpDto): Promise<{
    success: boolean;
    message: string;
  }> {
    const email = dto.email.toLowerCase().trim();
    const school = await this.schoolRepository.findOne({ where: { email } });
    if (!school) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }
  
    if (
      !school.otp ||
      school.otp !== dto.otp ||
      !school.otp_expires_at ||
      school.otp_expires_at.getTime() < Date.now()
    ) {
      throw new UnauthorizedException(AuthMessages.INVALID_OR_EXPIRED_OTP);
    }
  
    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }
  async forgotPassword(dto: ForgotPasswordDto): Promise<{
    success: boolean;
    message: string;
  }> {
    const email = dto.email.toLowerCase().trim();
    const school = await this.schoolRepository.findOne({ where: { email } });
    if (!school) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    const otp = this.generateSixDigitOtp();
    school.otp = otp;
    school.otp_expires_at = this.getOtpExpiryDate();
    await this.schoolRepository.save(school);

    // const frontend = this.configService
    //   .getOrThrow<string>('FRONTEND_URL')
    //   .replace(/\/$/, '');
    // const resetUrl = `${frontend}/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

    await this.mailService.sendForgotPasswordEmail({
      to: school.email,
      ownerName: school.owner_name,
      otp,
    });

    return {
      success: true,
      message: AuthMessages.PASSWORD_RESET_OTP_SENT,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{
    success: boolean;
    message: string;
  }> {
    const email = dto.email.toLowerCase().trim();
    const school = await this.schoolRepository.findOne({ where: { email } });
    if (!school) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    if (
      !school.otp ||
      school.otp !== dto.otp ||
      !school.otp_expires_at ||
      school.otp_expires_at.getTime() < Date.now()
    ) {
      throw new UnauthorizedException(AuthMessages.INVALID_OR_EXPIRED_OTP);
    }

    const password_hash = await bcrypt.hash(
      dto.newPassword,
      BCRYPT_SALT_ROUNDS,
    );
    school.password_hash = password_hash;
    school.otp = null;
    school.otp_expires_at = null;
    await this.schoolRepository.save(school);

    return {
      success: true,
      message: AuthMessages.PASSWORD_RESET_SUCCESS,
    };
  }

  /**
   * Clears the HTTP-only auth cookie to end the browser session.
   */
  logout(res: Response): { success: boolean; message: string } {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    res.clearCookie(TALEEM_TOKEN_COOKIE, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
    });
    return {
      success: true,
      message: AuthMessages.LOGOUT_SUCCESS,
    };
  }

  //  * Creates a signed JWT for the given school record.
  //  */
  private signAccessToken(school: School): string {
    const payload: TaleemJwtPayload = {
      sub: school.id.toString(),
      email: school.email,
      role: school.role,
      schoolId: school.school_id,
    };
    return this.jwtService.sign(payload as object);
  }

  /**
   * Resolves the full frontend dashboard URL for a role using FRONTEND_URL and role path map.
   */
  private buildDashboardUrl(role: SchoolRoleValue): string {
    const frontend = this.configService
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');
    const path = ROLE_DASHBOARD_PATHS[role];
    return `${frontend}${path}`;
  }

  /**
   * Computes OTP expiry as now plus the configured OTP window.
   */
  private getOtpExpiryDate(): Date {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  }

  /**
   * Generates a cryptographically secure 6-digit numeric OTP string.
   */
  private generateSixDigitOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  /**
   * Allocates a unique business school identifier in the form TH-{year}-XXXX.
   */
  private async generateUniqueBusinessSchoolId(
    schoolName: string,
  ): Promise<string> {
    const baseSlug = schoolName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const taken = await this.schoolRepository.exist({
        where: { school_id: slug },
      });
      if (!taken) return slug;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Renders a minimal HTML confirmation page for superadmin approve/reject actions.
   */
  private buildSuperadminActionPage(title: string, body: string): string {
    const frontend = this.configService
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');
    const dashboardUrl = `${frontend}/super-admin/dashboard`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.escapeHtml(title)} — Taleem Hub</title>
  <style>
    body { font-family: Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 48px 16px; color: #1e293b; }
    .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(15,23,42,0.08); }
    h1 { margin: 0 0 12px; font-size: 22px; color: #0f766e; }
    p { margin: 0 0 24px; line-height: 1.6; }
    a.btn { display: inline-block; padding: 12px 24px; background: #0d9488; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${this.escapeHtml(title)}</h1>
    <p>${this.escapeHtml(body)}</p>
    <a class="btn" href="${this.escapeAttr(dashboardUrl)}">Back to dashboard</a>
  </div>
</body>
</html>`;
  }

  /** Escapes plain text for safe HTML embedding in server-rendered pages. */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Escapes a string for inclusion in HTML attribute values. */
  private escapeAttr(text: string): string {
    return this.escapeHtml(text).replace(/'/g, '&#39;');
  }
}
