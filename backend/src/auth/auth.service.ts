import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ForgotPwRequestDto } from './dto/forgot-pw-request.dto';
import { createHash, randomBytes } from 'crypto';
import { ForgotPwResponseDto } from './dto/forgot-pw-response.dto';
import { ChangePasswordRequestDto } from './dto/change-password-request.dto';
import { PasswordResetToken } from 'src/user/entities/pw-reset-token.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(userDto: RegisterRequestDto): Promise<void> {
    const existing = await this.usersRepository.findOne({
      where: [{ email: userDto.email }, { username: userDto.username }],
    });
    if (existing) {
      throw new UnauthorizedException('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(userDto.password, 10);

    const user = this.usersRepository.create({
      username: userDto.username,
      email: userDto.email,
      passwordHash,
    });

    await this.usersRepository.save(user);
  }

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { username: loginDto.username },
    });

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.uid,
      username: user.username,
      userId: user.uid,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async forgotPassword(dto: ForgotPwRequestDto): Promise<ForgotPwResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    const genericMessage = 'If the email exists, a reset link has been sent.';

    if (!user) {
      return { message: genericMessage };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const resetToken = this.passwordResetTokenRepository.create({
      token: tokenHash,
      user,
      expiresAt,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await this.mailService.sendPasswordResetEmail(user.email, resetLink);

    return { message: genericMessage };
  }

  async verifyResetToken(token: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token: tokenHash },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException({
        message: ['Invalid Token'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const now = new Date();

    if (resetToken.expiresAt < now) {
      throw new BadRequestException({
        message: ['Token has expired'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }

  async changePassword(dto: ChangePasswordRequestDto): Promise<void> {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');

    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token: tokenHash },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException(['Invalid Token']);
    }

    const now = new Date();

    if (resetToken.expiresAt < now) {
      throw new BadRequestException(['Token has expired']);
    }

    const user = resetToken.user;

    if (!user) {
      throw new BadRequestException(['Invalid Token']);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    user.passwordHash = passwordHash;
    await this.usersRepository.save(user);

    await this.passwordResetTokenRepository.delete({
      uid: resetToken.uid,
    });
  }
}
