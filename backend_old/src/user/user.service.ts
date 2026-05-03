import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/_dto/auth.createUser';
import axios from 'axios';
import { User } from '@prisma/client';
import { RankInfo, Ratings } from 'src/_interface/ranked.rank';
import { unrankedRatingDeviation } from 'src/ranked/ranks';
import { RanksService } from 'src/ranked/ranks.service';
import { FileStorageService } from './file-storage.service';
import { UserSession } from 'src/_interface/session.userSession';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => RanksService))
    private ranksService: RanksService,
    private fileStorageService: FileStorageService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    clientIp: string,
  ): Promise<User | null> {
    // Fetch the country code using the client's IP address
    let countryCode = '';
    let country = '';
    try {
      const { data } = await axios.get(`http://ip-api.com/json/${clientIp}`);
      countryCode = data.countryCode;
      country = data.country;
    } catch (error) {
      console.error('Failed to fetch ip api data:', error);
    }

    // Check if a user with the given username already exists
    const existingUser = await this.userExists(createUserDto.username);
    if (existingUser) {
      throw new BadRequestException({
        message: ['Username already taken'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    // Check if a user with the given email already exists
    const existingEmail = await this.emailExists(createUserDto.email);
    if (existingEmail) {
      throw new BadRequestException({
        message: ['Email already taken'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    // If no existing user, proceed with creating a new user
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        countryCode,
        country,
      },
    });

    delete user.password;
    return user;
  }

  async emailExists(email: string): Promise<boolean> {
    if (!email || email.trim() === '') {
      return false;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
    return !!user;
  }

  async userExists(username: string): Promise<boolean> {
    if (!username || username.trim() === '') {
      return false;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    return !!user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: [`User with Username ${username} not found`],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: [`User with email ${email} not found`],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: [`User with ID ${id} not found`],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    return user;
  }

  async fillUserSessionWithDBInfo(session: UserSession): Promise<UserSession> {
    const userId = session.userId;
    const user: User = await this.getUserById(userId);
    const globalRank: number = await this.getGlobalRank(userId);
    const percentile: number = await this.getPercentile(user.id);
    const rankInfos: RankInfo = await this.ranksService.getRankInfo(user.id);
    const probablyAroundRank: RankInfo =
      await this.ranksService.getProbablyAroundRank(user.id);

    return {
      role: session.role,
      username: session.username,
      currentPage: session.currentPage,
      clientId: session.clientId,
      isRanked: session.isRanked,
      userId: user.id,
      email: user.email,
      countryCode: user.countryCode,
      country: user.country,
      pbUrl: user.pbUrl,
      bannerUrl: user.bannerUrl,
      LastDisconnectedAt: user.LastDisconnectedAt,
      rating: user.rating,
      ratingDeviation: user.ratingDeviation,
      volatility: user.volatility,
      createdAt: user.createdAt,
      rank: rankInfos,
      globalRank: globalRank,
      percentile: percentile,
      probablyAroundRank: probablyAroundRank,
    };
  }

  async getGlickoRatingsByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        rating: true,
        ratingDeviation: true,
        volatility: true,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: [`User with ID ${userId} not found`],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    return user;
  }

  updateGlickoRating(
    winnerID: number,
    winnerRatings: Ratings,
    loserID: number,
    loserRatings: Ratings,
  ): Promise<any> {
    return this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: winnerID },
        data: {
          rating: winnerRatings.rating,
          ratingDeviation: winnerRatings.ratingDeviation,
          volatility: winnerRatings.volatility,
        },
      }),
      this.prisma.user.update({
        where: { id: loserID },
        data: {
          rating: loserRatings.rating,
          ratingDeviation: loserRatings.ratingDeviation,
          volatility: loserRatings.volatility,
        },
      }),
    ]);
  }

  async getPercentile(userId: number): Promise<number> {
    const rank = await this.getGlobalRank(userId);
    const totalUsers = await this.getNumberOfRankedPlayers();
    return Math.round(((rank / totalUsers) * 100 + Number.EPSILON) * 100) / 100;
  }

  async getPercentiles(
    userIds: number[],
  ): Promise<{ [userId: number]: number }> {
    const userRanks = await this.getGlobalRanks(userIds);
    const rankedUsers = await this.getNumberOfRankedPlayers();
    const percentiles = {};
    userIds.forEach(userId => {
      const rank = userRanks[userId];
      const percentile =
        Math.round(((rank / rankedUsers) * 100 + Number.EPSILON) * 100) / 100;
      percentiles[userId] = percentile;
    });
    return percentiles;
  }

  async getProbablyAroundPercentile(userId: number): Promise<number> {
    const probablyRank = await this.getProbableGlobalRank(userId);
    const totalUsersAndMe = (await this.getNumberOfRankedPlayers()) + 1;
    return (
      Math.round(
        ((probablyRank / totalUsersAndMe) * 100 + Number.EPSILON) * 100,
      ) / 100
    );
  }

  async getGlobalRank(userId: number): Promise<number> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          ratingDeviation: {
            lte: unrankedRatingDeviation - 1,
          },
        },
        select: {
          id: true,
        },
        orderBy: [
          {
            rating: 'desc',
          },
          {
            ratingDeviation: 'asc',
          },
          {
            username: 'asc',
          },
        ],
      });
      const userIndex = users.findIndex(user => user.id === userId);
      return userIndex + 1;
    } catch (error) {
      console.error('Error getting global rank.');
      return null;
    }
  }

  async getGlobalRanks(
    userIds: number[],
  ): Promise<{ [userId: number]: number }> {
    try {
      // Fetch the sorted list of all users by their ranking criteria
      const users = await this.prisma.user.findMany({
        where: {
          ratingDeviation: {
            lte: unrankedRatingDeviation - 1,
          },
        },
        orderBy: [
          { rating: 'desc' },
          { ratingDeviation: 'asc' },
          { username: 'asc' },
        ],
        select: { id: true, rating: true, ratingDeviation: true }, // Select only necessary fields
      });

      // Convert the sorted list into a map for faster lookup
      const rankMap = new Map(users.map((user, index) => [user.id, index + 1]));

      // Create a result object to store the rank of each requested userId
      const ranks = {};
      userIds.forEach(userId => {
        ranks[userId] = rankMap.get(userId) || null; // Use null or appropriate value for users not found
      });
      return ranks;
    } catch (error) {
      console.error('Error getting global ranks:', error);
      throw error; // Rethrow or handle as needed
    }
  }

  async getNumberOfRankedPlayers(): Promise<number | null> {
    try {
      const count = await this.prisma.user.count({
        where: {
          ratingDeviation: {
            lte: unrankedRatingDeviation - 1,
          },
        },
      });
      return count;
    } catch (error) {
      console.error('Error retrieving number of ranked players.');
      return null;
    }
  }

  async getProbableGlobalRank(userId: number): Promise<number> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              ratingDeviation: {
                lte: unrankedRatingDeviation - 1,
              },
            },
            { id: userId }, // Ensure the specified user is always included
          ],
        },
        select: {
          id: true,
          rating: true, // Needed for ordering
          ratingDeviation: true, // Needed for ordering
          username: true, // Needed for ordering
        },
        orderBy: [
          { rating: 'desc' },
          { ratingDeviation: 'asc' },
          { username: 'asc' },
        ],
      });

      // Calculate rank based on position in sorted list
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        return null; // User not found in the list, which shouldn't happen but good to handle
      }
      return userIndex + 1; // Adjusting for zero-based index to get the rank
    } catch (error) {
      console.error('Error getting global rank:', error);
      return null;
    }
  }

  async isRanked(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { ratingDeviation: true },
    });
    if (user.ratingDeviation >= unrankedRatingDeviation) {
      return false;
    }
    return true;
  }

  async updateProfileImgs(
    userId: number,
    file: Express.Multer.File,
    imgType: 'pb' | 'banner',
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const fieldToUpdate = imgType === 'pb' ? 'pbUrl' : 'bannerUrl';
    const oldFilename = user[fieldToUpdate];

    // Upload the new file to DigitalOcean Spaces and get the URL
    const fileUrl = await this.fileStorageService.uploadFile(file, imgType);

    // Update the database with the new file URL
    await this.prisma.user.update({
      where: { id: userId },
      data: { [fieldToUpdate]: fileUrl },
    });

    // Delete the old file from DigitalOcean Spaces if it's different from the new one
    if (oldFilename && oldFilename !== fileUrl) {
      await this.fileStorageService.deleteFile(oldFilename, imgType);
    }
  }

  async updateUserSettings(userId: number, settings: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { settings: settings },
    });
  }

  async getUserSettings(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });
    return user.settings;
  }
}
