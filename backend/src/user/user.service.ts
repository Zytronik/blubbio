import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileImageResponseDto } from '@shared/types';
import { BlobService } from 'src/blob/blob.service';
import { SettingsDto } from '@shared/types';
import { GetUserRatingResponseDto } from '@shared/types';
import { RankedService } from 'src/ranked/ranked.service';
import { GetUserProfileResponseDto } from '@shared/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly blobService: BlobService,
    private readonly rankedService: RankedService,
  ) {}

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username: username.toLowerCase() },
    });

    return !user;
  }

  async updateProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldUrl = user.pbUrl;

    const newUrl = await this.blobService.uploadFile(file, 'pb');

    await this.userRepository.update(userId, {
      pbUrl: newUrl,
    });

    if (oldUrl) {
      await this.blobService.deleteFile(oldUrl).catch((err) => {
        console.warn('Failed to delete old profile picture:', err);
      });
    }

    return {
      message: 'Profile picture updated successfully',
    };
  }

  async updateProfileBanner(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldUrl = user.bannerUrl;

    const newUrl = await this.blobService.uploadFile(file, 'banner');

    await this.userRepository.update(userId, {
      bannerUrl: newUrl,
    });

    if (oldUrl) {
      await this.blobService.deleteFile(oldUrl).catch((err) => {
        console.warn('Failed to delete old banner:', err);
      });
    }

    return {
      message: 'Profile banner updated successfully',
    };
  }

  async saveSettings(userId: string, dto: SettingsDto): Promise<void> {
    const json = JSON.stringify(dto);

    await this.userRepository.update(userId, {
      settings: json,
    });
  }

  async getSettings(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });

    if (!user?.settings) {
      return '';
    }

    return user.settings;
  }

  async getUserRating(userId: string): Promise<GetUserRatingResponseDto> {
    return this.rankedService.buildUserRatingDto(userId);
  }

  async getUserProfile(userId: string): Promise<GetUserProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
      countryCode: user.countryCode,
      country: user.country,
      pbUrl: user.pbUrl,
      bannerUrl: user.bannerUrl,
      lastDisconnectedAt: user.lastDisconnectedAt,
      settings: user.settings,
      createdAt: user.createdAt,
    };
  }
}
