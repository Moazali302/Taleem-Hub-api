import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  MailBranding,
  MailSubjects,
} from '../../common/constants/auth.constants';

/**
 * Sends transactional emails for Taleem Hub via Gmail SMTP.
 * All templates use branded HTML layouts for a consistent professional look.
 */
@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });
  }

  /**
   * Builds the RFC5322 From header with display name and configured SMTP mailbox.
   */
  private getFromHeader(): string {
    const user = this.configService.getOrThrow<string>('MAIL_USER');
    return `"${MailBranding.FROM_DISPLAY_NAME}" <${user}>`;
  }

  /**
   * Applies the shared Taleem Hub HTML layout (header, typography, footer) around inner content.
   */
  private wrapBrandedHtml(title: string, innerHtml: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Taleem Hub</h1>
              <p style="margin:8px 0 0;color:#e0f2f1;font-size:14px;">School Management System — Pakistan</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#1e293b;font-size:15px;line-height:1.6;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">
              © ${new Date().getFullYear()} Taleem Hub. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  /**
   * Delivers an HTML message through the configured Nodemailer transport.
   */
  private async sendHtmlMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.getFromHeader(),
      to,
      subject,
      html,
    });
  }

  /**
   * Notifies the school owner that registration was received and is under review.
   */
  async sendRegistrationWelcomeEmail(params: {
    to: string;
    ownerName: string;
    schoolName: string;
  }): Promise<void> {
    const inner = `
      <p style="margin:0 0 16px;">Dear ${this.escapeHtml(params.ownerName)},</p>
      <p style="margin:0 0 16px;">Thank you for registering <strong>${this.escapeHtml(params.schoolName)}</strong> on Taleem Hub. Your registration is currently under review.</p>
      <p style="margin:0 0 16px;">Within 24 hours our team will verify your details and activate your account.</p>
      <p style="margin:0 0 16px;">For any queries contact us at <a href="mailto:taleemhub2026@gmail.com" style="color:#0d9488;">taleemhub2026@gmail.com</a>.</p>
      <p style="margin:0;">Warm Regards,<br/><strong>Taleem Hub Team</strong></p>
    `;
    await this.sendHtmlMail(
      params.to,
      MailSubjects.REGISTRATION_WELCOME,
      this.wrapBrandedHtml('Registration Received', inner),
    );
  }

  /**
   * Alerts the platform superadmin of a new school registration with approve/reject action links.
   */
  async sendNewSchoolRegistrationNotificationToSuperadmin(params: {
    to: string;
    schoolName: string;
    ownerName: string;
    schoolAddress: string;
    phone: string;
    email: string;
    schoolBusinessId: string;
    registeredAtIso: string;
    approveUrl: string;
    rejectUrl: string;
  }): Promise<void> {
    const inner = `
      <p style="margin:0 0 16px;font-weight:600;">A new school has registered on Taleem Hub.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr><td style="padding:8px 0;color:#64748b;width:140px;">School name</td><td style="padding:8px 0;"><strong>${this.escapeHtml(params.schoolName)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Owner</td><td style="padding:8px 0;">${this.escapeHtml(params.ownerName)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Address</td><td style="padding:8px 0;">${this.escapeHtml(params.schoolAddress)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${this.escapeHtml(params.phone)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;">${this.escapeHtml(params.email)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">School ID</td><td style="padding:8px 0;"><code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">${this.escapeHtml(params.schoolBusinessId)}</code></td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Registered at</td><td style="padding:8px 0;">${this.escapeHtml(params.registeredAtIso)}</td></tr>
      </table>
      <p style="margin:0 0 20px;font-size:14px;">Please review and take action:</p>
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding-right:12px;">
            <a href="${this.escapeAttr(params.approveUrl)}" style="display:inline-block;padding:14px 28px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">APPROVE</a>
          </td>
          <td>
            <a href="${this.escapeAttr(params.rejectUrl)}" style="display:inline-block;padding:14px 28px;background:#dc2626;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">REJECT</a>
          </td>
        </tr>
      </table>
    `;
    await this.sendHtmlMail(
      params.to,
      MailSubjects.NEW_REGISTRATION_SUPERADMIN,
      this.wrapBrandedHtml('Action Required', inner),
    );
  }

  /**
   * Sends approval confirmation to the school admin with login guidance.
   */
  async sendSchoolApprovedEmail(params: {
    to: string;
    ownerName: string;
    schoolName: string;
    schoolBusinessId: string;
    loginUrl: string;
  }): Promise<void> {
    const inner = `
      <p style="margin:0 0 16px;">Dear ${this.escapeHtml(params.ownerName)},</p>
      <p style="margin:0 0 16px;">Your school <strong>${this.escapeHtml(params.schoolName)}</strong> has been approved.</p>
      <p style="margin:0 0 16px;">Your School ID is <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">${this.escapeHtml(params.schoolBusinessId)}</code>.</p>
      <p style="margin:0 0 16px;">You can log in at <a href="${this.escapeAttr(params.loginUrl)}" style="color:#0d9488;font-weight:600;">${this.escapeHtml(params.loginUrl)}</a>.</p>
      <p style="margin:0;">Contact <a href="mailto:taleemhub2026@gmail.com" style="color:#0d9488;">taleemhub2026@gmail.com</a> for support.</p>
    `;
    await this.sendHtmlMail(
      params.to,
      MailSubjects.APPROVAL_CONGRATS,
      this.wrapBrandedHtml('School Approved', inner),
    );
  }

  /**
   * Notifies the school owner that registration was rejected.
   */
  async sendSchoolRejectedEmail(params: {
    to: string;
    ownerName: string;
  }): Promise<void> {
    const inner = `
      <p style="margin:0 0 16px;">Dear ${this.escapeHtml(params.ownerName)},</p>
      <p style="margin:0 0 16px;">Unfortunately your school registration has been rejected.</p>
      <p style="margin:0;">Please contact <a href="mailto:taleemhub2026@gmail.com" style="color:#0d9488;">taleemhub2026@gmail.com</a> for more information.</p>
    `;
    await this.sendHtmlMail(
      params.to,
      MailSubjects.REGISTRATION_REJECTED_UPDATE,
      this.wrapBrandedHtml('Registration Update', inner),
    );
  }

  /**
   * Sends a one-time password for login verification.
   */
  async sendLoginOtpEmail(params: {
    to: string;
    ownerName: string;
    otp: string;
  }): Promise<void> {
    const inner = `
      <p style="margin:0 0 16px;">Dear ${this.escapeHtml(params.ownerName)},</p>
      <p style="margin:0 0 16px;">Your One-Time Password is:</p>
      <p style="margin:0 0 24px;font-size:28px;letter-spacing:8px;font-weight:700;color:#0d9488;">${this.escapeHtml(params.otp)}</p>
      <p style="margin:0 0 16px;color:#64748b;font-size:14px;">Valid for 5 minutes only. Do not share with anyone.</p>
    `;
    await this.sendHtmlMail(
      params.to,
      MailSubjects.LOGIN_OTP,
      this.wrapBrandedHtml('Login OTP', inner),
    );
  }

  /**
   * Sends password reset link containing email and OTP as query parameters.
   */
  async sendForgotPasswordEmail(params: {
    to: string;
    ownerName: string;
    resetUrl: string;
  }): Promise<void> {
    const inner = `
      <p style="margin:0 0 16px;">Dear ${this.escapeHtml(params.ownerName)},</p>
      <p style="margin:0 0 16px;">Click the button below to reset your Taleem Hub password. This link is valid for 5 minutes only.</p>
      <p style="margin:24px 0;">
        <a href="${this.escapeAttr(params.resetUrl)}" style="display:inline-block;padding:14px 28px;background:#0d9488;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;">Reset password</a>
      </p>
      <p style="margin:0;font-size:12px;color:#94a3b8;word-break:break-all;">If the button does not work, copy this link: ${this.escapeHtml(params.resetUrl)}</p>
    `;
    await this.sendHtmlMail(
      params.to,
      MailSubjects.FORGOT_PASSWORD,
      this.wrapBrandedHtml('Password Reset', inner),
    );
  }

  /**
   * Escapes text for safe insertion into HTML body content.
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Escapes text for use inside HTML attribute values (e.g. href).
   */
  private escapeAttr(text: string): string {
    return this.escapeHtml(text).replace(/'/g, '&#39;');
  }
}
