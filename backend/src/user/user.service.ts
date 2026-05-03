import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileImageResponseDto } from './dto/update-profile-image-response.dto';
import { BlobService } from 'src/blob/blob.service';
import { SettingsDto } from './dto/settings.dto';
import { SaveSettingsResponseDto } from './dto/save-settings-response.dto';
import { GetUserRatingResponseDto } from './dto/get-user-rating.response.dto';
import { RankedService } from 'src/ranked/ranked.service';
import { GetUserProfileResponseDto } from './dto/get-user-profile.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly blobService: BlobService,
    private readonly rankedService: RankedService,
  ) { }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        username: ILike(username),
      },
    });

    return !user;
  }

  async updateProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    const url = await this.blobService.uploadFile(file, 'pb');

    await this.userRepository.update(userId, {
      pbUrl: url,
    });

    return {
      message: 'Profile picture updated successfully',
    };
  }

  async updateProfileBanner(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    const url = await this.blobService.uploadFile(file, 'banner');

    await this.userRepository.update(userId, {
      bannerUrl: url,
    });

    return {
      message: 'Profile banner updated successfully',
    };
  }

  async saveSettings(
    userId: string,
    dto: SettingsDto,
  ): Promise<SaveSettingsResponseDto> {
    const json = JSON.stringify(dto);

    await this.userRepository.update(userId, {
      settings: json,
    });

    return {
      message: 'Settings saved successfully',
    };
  }

  async getSettings(userId: string): Promise<SettingsDto> {
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });

    if (!user?.settings) {
      throw new BadRequestException('No settings found for this user.');
    }

    return JSON.parse(user.settings);
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
