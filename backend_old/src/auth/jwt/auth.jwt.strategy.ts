import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Use environment variable
    });
  }

  async validate(payload: any) {
    const tokenJTI = payload.jti; // Ensure this matches the JWT token's unique identifier field

    const blacklisted = await this.prisma.tokenBlacklist.findUnique({
      where: { tokenJTI },
    });

    if (blacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return { userId: payload.userId, username: payload.username };
  }
}
