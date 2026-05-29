import { Injectable, NotFoundException } from '@nestjs/common';
import { Rank } from '@shared/types';
import { ranks } from './data/rank.data';
import { unrankedRatingDeviation } from './data/unranked-rating-deviation.data';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UserRating } from 'src/ranked/entities/user-rating.entity';
import { GetUserRatingResponseDto } from '@shared/types';

@Injectable()
export class RankedService {
  constructor(
    @InjectRepository(UserRating)
    private readonly userRatingRepository: Repository<UserRating>,
  ) {}

  async buildUserRatingDto(userId: string): Promise<GetUserRatingResponseDto> {
    const rating = await this.userRatingRepository.findOne({
      where: { user: { uid: userId } },
      relations: ['user'],
    });

    if (!rating) {
      throw new NotFoundException('Rating not found for user');
    }

    const isRanked = rating.ratingDeviation < unrankedRatingDeviation;

    const probablePercentile = await this.getProbablyAroundPercentile(userId);
    const probablyAroundRank = this.getRankFromPercentile(probablePercentile);

    const globalRank = await this.getGlobalRank(userId);
    const nationalRank = await this.getNationalRank(userId);
    const percentile = await this.getPercentile(userId);
    const rank = this.getRankFromPercentile(percentile);

    const allRanks = ranks;

    const currentIndex = allRanks.findIndex((r) => r.name === rank.name);

    const prevRank = currentIndex > 0 ? allRanks[currentIndex - 1] : undefined;
    const nextRank =
      currentIndex < allRanks.length - 1
        ? allRanks[currentIndex + 1]
        : undefined;

    return {
      rating: rating.rating,
      ratingDeviation: rating.ratingDeviation,
      volatility: rating.volatility,
      isRanked,
      rank,
      prevRank,
      nextRank,
      probablyAroundRank,
      globalRank,
      nationalRank,
      percentile,
    };
  }

  async getPercentile(userId: string): Promise<number> {
    const rank = await this.getGlobalRank(userId);
    const totalUsers = await this.getNumberOfRankedPlayers();
    return Math.round(((rank / totalUsers) * 100 + Number.EPSILON) * 100) / 100;
  }

  async getProbablyAroundRank(userId: string): Promise<Rank> {
    const percentile = await this.getProbablyAroundPercentile(userId);
    return this.getRankFromPercentile(percentile);
  }

  async getProbablyAroundPercentile(userId: string): Promise<number> {
    const probablyRank = await this.getProbableGlobalRank(userId);
    const totalUsersAndMe = (await this.getNumberOfRankedPlayers()) + 1;
    return (
      Math.round(
        ((probablyRank / totalUsersAndMe) * 100 + Number.EPSILON) * 100,
      ) / 100
    );
  }

  async getNumberOfRankedPlayers(): Promise<number> {
    return this.userRatingRepository.count({
      where: {
        ratingDeviation: LessThan(unrankedRatingDeviation),
      },
    });
  }

  async getProbableGlobalRank(userId: string): Promise<number> {
    const users = await this.userRatingRepository.find({
      relations: ['user'],
      where: [
        {
          ratingDeviation: LessThan(unrankedRatingDeviation),
        },
        {
          user: { uid: userId },
        },
      ],
      order: {
        rating: 'DESC',
        ratingDeviation: 'ASC',
        user: {
          username: 'ASC',
        },
      },
    });

    const index = users.findIndex((u) => u.user.uid === userId);

    if (index === -1) {
      throw new Error(`User ${userId} not found in ranking list`);
    }

    return index + 1;
  }

  async isRanked(userId: string): Promise<boolean> {
    const user = await this.userRatingRepository.findOne({
      where: { user: { uid: userId } },
      select: ['ratingDeviation'],
      relations: ['user'],
    });

    if (!user) return false;

    return user.ratingDeviation < unrankedRatingDeviation;
  }

  getRankFromPercentile(percentile: number): Rank {
    return (
      ranks.find((rank) => percentile >= rank.percentile) ??
      ranks[ranks.length - 1]
    );
  }

  async getGlobalRank(userId: string): Promise<number> {
    const users = await this.userRatingRepository
      .createQueryBuilder('rating')
      .leftJoin('rating.user', 'user')
      .where('rating.ratingDeviation <= :threshold', {
        threshold: unrankedRatingDeviation - 1,
      })
      .orWhere('user.uid = :userId', { userId })
      .orderBy('rating.rating', 'DESC')
      .addOrderBy('rating.ratingDeviation', 'ASC')
      .addOrderBy('user.username', 'ASC')
      .select(['rating.uid', 'user.uid'])
      .getMany();

    const index = users.findIndex((r) => r.user.uid === userId);

    if (index === -1) {
      throw new NotFoundException(`User ${userId} not found in ranking list`);
    }

    return index + 1;
  }

  async getNationalRank(userId: string): Promise<number | null> {
    const user = await this.userRatingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.user', 'user')
      .where('user.uid = :userId', { userId })
      .getOne();

    if (!user?.user.countryCode) {
      return null;
    }

    const users = await this.userRatingRepository
      .createQueryBuilder('rating')
      .leftJoin('rating.user', 'user')
      .where('user.countryCode = :countryCode', {
        countryCode: user.user.countryCode,
      })
      .andWhere('rating.ratingDeviation <= :threshold', {
        threshold: unrankedRatingDeviation - 1,
      })
      .orderBy('rating.rating', 'DESC')
      .addOrderBy('rating.ratingDeviation', 'ASC')
      .addOrderBy('user.username', 'ASC')
      .select(['rating.uid', 'user.uid'])
      .getMany();

    const index = users.findIndex((r) => r.user.uid === userId);

    if (index === -1) {
      throw new NotFoundException(
        `User ${userId} not found in national ranking`,
      );
    }

    return index + 1;
  }
}
