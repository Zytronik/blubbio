import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokensCleanupService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpExpiredTokens() {
    const now = new Date();
    await this.prisma.tokenBlacklist.deleteMany({
      where: {
        expiresAt: {
          lt: now, // "lt" stands for "less than"
        },
      },
    });

    await this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: now, // "lt" stands for "less than"
        },
      },
    });

    console.log('Expired tokens cleanup completed');
  }
}
