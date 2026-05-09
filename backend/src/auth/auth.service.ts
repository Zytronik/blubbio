import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DeepPartial, Repository } from 'typeorm';
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
import { UserRating } from 'src/ranked/entities/user-rating.entity';
import axios from 'axios';
import { Request } from 'express';
import { IpApiResponse } from './dto/ip-api-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(UserRating)
    private userRatingRepository: Repository<UserRating>,
  ) {}

  async register(userDto: RegisterRequestDto, req: Request): Promise<void> {
    const username = userDto.username.toLowerCase();
    const email = userDto.email.toLowerCase();

    const existing = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existing) {
      throw new UnauthorizedException('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(userDto.password, 10);

    // --- IP extraction
    const clientIp = this.getClientIp(req);

    let countryCode: string | null = null;
    let country: string | null = null;

    try {
      if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1') {
        const { data } = await axios.get<IpApiResponse>(
          `http://ip-api.com/json/${clientIp}`,
        );

        countryCode = data.countryCode;
        country = data.country;
      }
    } catch (err) {
      console.error('IP geo lookup failed:', err);
    }

    const user = this.usersRepository.create({
      username,
      email,
      passwordHash,
      countryCode,
      country,
    } as DeepPartial<User>);

    await this.usersRepository.save(user);

    const rating = this.userRatingRepository.create({ user });
    await this.userRatingRepository.save(rating);
  }

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const username = loginDto.username.toLowerCase();

    const user = await this.usersRepository.findOne({
      where: { username },
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

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];

    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }

    return req.socket?.remoteAddress || req.ip || '';
  }
}
