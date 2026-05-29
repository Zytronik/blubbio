import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from '@shared/types';
import { LoginRequestDto } from '@shared/types';
import { LoginResponseDto } from '@shared/types';
import { ForgotPwRequestDto } from '@shared/types';
import { ForgotPwResponseDto } from '@shared/types';
import { VerifyResetTokenRequestDto } from '@shared/types';
import { ChangePasswordRequestDto } from '@shared/types';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201 })
  async register(
    @Body() dto: RegisterRequestDto,
    @Req() req: Request,
  ): Promise<void> {
    return this.authService.register(dto, req);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, type: ForgotPwResponseDto })
  async forgotPassword(
    @Body() dto: ForgotPwRequestDto,
  ): Promise<ForgotPwResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @Post('verify-reset-token')
  @ApiOperation({ summary: 'Verify reset token validity' })
  @ApiResponse({ status: 200 })
  async verifyResetToken(
    @Body() dto: VerifyResetTokenRequestDto,
  ): Promise<void> {
    await this.authService.verifyResetToken(dto.token);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password using reset token' })
  @ApiResponse({ status: 200 })
  async changePassword(@Body() dto: ChangePasswordRequestDto): Promise<void> {
    await this.authService.changePassword(dto);
  }
}
