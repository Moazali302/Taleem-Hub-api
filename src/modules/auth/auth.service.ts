import {
  ForbiddenException,
  Injectable,
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

import { User } from '../../database/entities/user.entity';

import {
  AuthMessages,
  BCRYPT_SALT_ROUNDS,
  JWT_COOKIE_MAX_AGE_HOURS,
  OTP_EXPIRY_MINUTES,
  ROLE_DASHBOARD_PATHS,
  SchoolRoleEnum,
  SchoolStatusEnum,
  TALEEM_TOKEN_COOKIE,
  type SchoolRoleValue,
} from '../../common/constants/auth.constants';

import { MailService } from '../mail/mail.service';

import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { TaleemJwtPayload } from './interfaces/jwt-payload.interface';

type LoginResult =
  | { success: boolean; message: string; requiresOtp: true }
  | { success: boolean; token: string; role: SchoolRoleValue; redirectTo: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, req: Request): Promise<LoginResult> {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['school'],
    });

    if (!user) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password_hash);

    if (!passwordOk) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    if (!user.is_active) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const isSuperadmin = user.role === SchoolRoleEnum.SUPERADMIN;

    if (!isSuperadmin) {
      this.assertSchoolAccess(user, dto.schoolId);
    }

    const reused = this.tryReuseCookieToken(req, email, user);
    if (reused) {
      return reused;
    }

    const otp = this.generateSixDigitOtp();

    user.otp = otp;
    user.otp_expires_at = this.getOtpExpiryDate();

    await this.userRepository.save(user);

    await this.mailService.sendLoginOtpEmail({
      to: user.email,
      ownerName: user.name,
      otp,
    });

    return {
      success: true,
      message: AuthMessages.OTP_SENT,
      requiresOtp: true,
    };
  }

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

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['school'],
    });

    if (!user) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const isSuperadmin = user.role === SchoolRoleEnum.SUPERADMIN;

    if (!isSuperadmin) {
      this.assertSchoolAccess(user);
    }

    if (!user.otp || user.otp !== dto.otp) {
      throw new UnauthorizedException(AuthMessages.INVALID_OR_EXPIRED_OTP);
    }

    if (!user.otp_expires_at || user.otp_expires_at.getTime() < Date.now()) {
      throw new UnauthorizedException(AuthMessages.OTP_EXPIRED);
    }

    user.otp = null;
    user.otp_expires_at = null;

    await this.userRepository.save(user);

    const token = this.signUserAccessToken(user);
    this.setAuthCookie(res, token);

    return {
      success: true,
      token,
      role: user.role as SchoolRoleValue,
      redirectTo: this.buildDashboardUrl(user.role as SchoolRoleValue),
      user: {
        name: user.name,
        email: user.email,
        schoolId: isSuperadmin ? '' : (user.school?.school_id ?? ''),
        role: user.role as SchoolRoleValue,
      },
    };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    const otp = this.generateSixDigitOtp();

    user.otp = otp;
    user.otp_expires_at = this.getOtpExpiryDate();

    await this.userRepository.save(user);

    await this.sendOtpEmail(user, otp, dto.mode);

    return {
      success: true,
      message: AuthMessages.OTP_SENT,
    };
  }

  async verifyResetOtp(dto: VerifyOtpDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    this.assertOtpValid(user, dto.otp);

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    const otp = this.generateSixDigitOtp();

    user.otp = otp;
    user.otp_expires_at = this.getOtpExpiryDate();

    await this.userRepository.save(user);

    await this.mailService.sendForgotPasswordEmail({
      to: user.email,
      ownerName: user.name,
      otp,
    });

    return {
      success: true,
      message: AuthMessages.PASSWORD_RESET_OTP_SENT,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    this.assertOtpValid(user, dto.otp);

    user.password_hash = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);
    user.otp = null;
    user.otp_expires_at = null;

    await this.userRepository.save(user);

    return {
      success: true,
      message: AuthMessages.PASSWORD_RESET_SUCCESS,
    };
  }

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

  // --- Shared helpers ---

  private assertSchoolAccess(user: User, schoolId?: string): void {
    if (schoolId !== undefined) {
      if (!schoolId || !user.school || schoolId !== user.school.school_id) {
        throw new UnauthorizedException(AuthMessages.INVALID_SCHOOL_ID);
      }
    }

    if (!user.school) {
      throw new UnauthorizedException(AuthMessages.INVALID_SCHOOL_ID);
    }

    if (user.school.status === SchoolStatusEnum.PENDING) {
      throw new ForbiddenException(AuthMessages.ACCOUNT_UNDER_REVIEW);
    }

    if (user.school.status === SchoolStatusEnum.REJECTED) {
      throw new ForbiddenException(AuthMessages.ACCOUNT_REJECTED);
    }
  }

  private assertOtpValid(user: User, otp: string): void {
    const isValid =
      user.otp &&
      user.otp === otp &&
      user.otp_expires_at &&
      user.otp_expires_at.getTime() >= Date.now();

    if (!isValid) {
      throw new UnauthorizedException(AuthMessages.INVALID_OR_EXPIRED_OTP);
    }
  }

  private async sendOtpEmail(user: User, otp: string, mode?: string): Promise<void> {
  if (mode === 'reset') {
    await this.mailService.sendForgotPasswordEmail({
      to: user.email,
      ownerName: user.name,
      otp,
    });
  } else {
    await this.mailService.sendLoginOtpEmail({
      to: user.email,
      ownerName: user.name,
      otp,
    });
  }
}

  private tryReuseCookieToken(req: Request, email: string, user: User): LoginResult | null {
    const cookieToken = req.cookies?.[TALEEM_TOKEN_COOKIE] as string | undefined;

    if (!cookieToken) {
      return null;
    }

    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = this.jwtService.verify<TaleemJwtPayload>(cookieToken, { secret });

      if (payload.email === email && payload.role === user.role) {
        return {
          success: true,
          token: cookieToken,
          role: user.role as SchoolRoleValue,
          redirectTo: this.buildDashboardUrl(user.role as SchoolRoleValue),
        };
      }
    } catch {
      // expired/invalid cookie — fall through to OTP flow
    }

    return null;
  }

  private setAuthCookie(res: Response, token: string): void {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie(TALEEM_TOKEN_COOKIE, token, {
      httpOnly: true,
      maxAge: JWT_COOKIE_MAX_AGE_HOURS * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: isProd,
      path: '/',
    });
  }

  private signUserAccessToken(user: User): string {
    const isSuperadmin = user.role === SchoolRoleEnum.SUPERADMIN;

    const payload: TaleemJwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role as SchoolRoleValue,
      schoolId: isSuperadmin ? '' : (user.school?.school_id ?? ''),
    };

    return this.jwtService.sign(payload as object);
  }

  private buildDashboardUrl(role: SchoolRoleValue): string {
    const frontend = this.configService.getOrThrow<string>('FRONTEND_URL').replace(/\/$/, '');
    return `${frontend}${ROLE_DASHBOARD_PATHS[role]}`;
  }

  private getOtpExpiryDate(): Date {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  }

  private generateSixDigitOtp(): string {
    return randomInt(100000, 1000000).toString();
  }
}