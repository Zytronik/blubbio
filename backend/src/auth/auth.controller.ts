import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ForgotPwRequestDto } from './dto/forgot-pw-request.dto';
import { ForgotPwResponseDto } from './dto/forgot-pw-response.dto';
import { VerifyResetTokenRequestDto } from './dto/verify-reset-token-request.dto';
import { ChangePasswordRequestDto } from './dto/change-password-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201 })
  async register(@Body() dto: RegisterRequestDto): Promise<void> {
    return this.authService.register(dto);
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
