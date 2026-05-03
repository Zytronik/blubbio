import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';
import { LoginDto } from 'src/_dto/auth.login';
import { RegisterDto } from 'src/_dto/auth.register';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private mailerService: MailerService,
  ) { }

  async register(registerDto: RegisterDto, clientIp: string): Promise<any> {
    return this.userService.createUser(registerDto, clientIp);
  }

  getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    let ip;
    if (typeof forwarded === 'string') {
      ip = forwarded.split(',')[0].trim();
    } else if (req.socket && req.socket.remoteAddress) {
      // Fallback to the direct IP address of the request.
      ip = req.socket.remoteAddress;
    }
    return ip;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.getUserByUsername(loginDto.username);

    if (!user) {
      throw new BadRequestException({
        message: ['Invalid credentials'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException({
        message: ['Invalid credentials'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const jti = crypto.randomBytes(16).toString('hex');

    const payload = {
      username: user.username,
      userId: user.id,
      jti: jti,
    };
    const secret = this.configService.get<string>('JWT_SECRET');
    const expi = this.configService.get<string>('JWT_EXI');
    return {
      access_token: this.jwtService.sign(payload, {
        secret,
        expiresIn: expi,
      }),
    };
  }

  async logout(token: string, userId: number): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as any;

    if (!decodedToken || !decodedToken.jti) {
      throw new BadRequestException({
        message: ['Invalid Logout Token'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const expiresAt = decodedToken.exp
      ? new Date(decodedToken.exp * 1000)
      : new Date();
    if (isNaN(expiresAt.getTime())) {
      throw new BadRequestException({
        message: ['Invalid expiration date'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    // Check if the tokenJTI is already in the blacklist
    const existingToken = await this.prisma.tokenBlacklist.findUnique({
      where: { tokenJTI: decodedToken.jti },
    });

    if (!existingToken) {
      // If not, blacklist the token
      await this.prisma.tokenBlacklist.create({
        data: {
          token: token, // The actual token string
          tokenJTI: decodedToken.jti, // The unique identifier of the token
          expiresAt: expiresAt, // Token expiry date
          userId: userId,
        },
      });
    } else {
      throw new BadRequestException({
        message: ['User already logged out'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException({
        message: ['Email does not exist'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const resetToken = this.generateResetToken();

    await this.saveResetToken(user.id, resetToken);

    try {
      await this.sendResetEmail(email, resetToken);
    } catch (error) {
      console.error('Error sending reset email:', error);

      throw new BadRequestException({
        message: [
          'Unable to send reset email at this time. Please try again later.',
        ],
        error: 'Service Unavailable',
        statusCode: 503,
      });
    }
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'blubb.io | Password Reset',
      template: 'password-reset',
      context: {
        resetLink,
      },
    });
  }

  private generateResetToken(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  private async saveResetToken(userId: number, token: string): Promise<void> {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1); // Token expires in 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        userId: userId,
        token: token,
        expiresAt: expirationTime,
      },
    });
  }

  async verifyToken(token: string): Promise<any> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
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

    return { message: 'Token is valid', userId: resetToken.userId };
  }

  async changePassword(token: string, newPassword: string): Promise<void> {
    const passwordResetEntry = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!passwordResetEntry) {
      throw new BadRequestException({
        message: ['Invalid or expired token'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const now = new Date();
    if (passwordResetEntry.expiresAt < now) {
      throw new BadRequestException({
        message: ['Token has expired'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: passwordResetEntry.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({
      where: { token },
    });
  }
}
