import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new school (pending approval)' })
  @ApiResponse({ status: 201 })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('approve/:schoolId')
  @ApiOperation({ summary: 'Approve a school (superadmin email link)' })
  async approve(
    @Param('schoolId') schoolId: string,
    @Res() res: Response,
  ): Promise<void> {
    const html = await this.authService.approveSchool(schoolId);
    res.type('html').send(html);
  }

  @Get('reject/:schoolId')
  @ApiOperation({ summary: 'Reject a school (superadmin email link)' })
  async reject(
    @Param('schoolId') schoolId: string,
    @Res() res: Response,
  ): Promise<void> {
    const html = await this.authService.rejectSchool(schoolId);
    res.type('html').send(html);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email/password; may return OTP requirement',
  })
  @ApiResponse({ status: 200 })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginDto, req);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify login OTP and receive JWT (also set as HTTP-only cookie)',
  })
  @ApiResponse({ status: 200 })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(verifyOtpDto, res);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset link with OTP' })
  @ApiResponse({ status: 200 })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using email and OTP' })
  @ApiResponse({ status: 200 })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear auth cookie' })
  @ApiResponse({ status: 200 })
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
