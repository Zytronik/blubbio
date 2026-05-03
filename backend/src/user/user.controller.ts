import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UsernameAvailabilityRequestDto } from './dto/username-availability-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileImageResponseDto } from './dto/update-profile-image-response.dto';
import { SaveSettingsResponseDto } from './dto/save-settings-response.dto';
import { SettingsDto } from './dto/settings.dto';
import { ValidateImagePipe } from './pipes/validate-image.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('username-available')
  async isUsernameAvailable(
    @Query() query: UsernameAvailabilityRequestDto,
  ): Promise<boolean> {
    return await this.userService.isUsernameAvailable(query.username);
  }

  @Post(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Param('id') userId: string,
    @UploadedFile(new ValidateImagePipe()) file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    return this.userService.updateProfilePicture(userId, file);
  }

  @Post(':id/profile-banner')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileBanner(
    @Param('id') userId: string,
    @UploadedFile(new ValidateImagePipe()) file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    return this.userService.updateProfileBanner(userId, file);
  }

  @Post(':id/settings')
  async saveSettings(
    @Param('id') userId: string,
    @Body() dto: SettingsDto,
  ): Promise<SaveSettingsResponseDto> {
    return this.userService.saveSettings(userId, dto);
  }

  @Get(':id/settings')
  async getSettings(@Param('id') userId: string): Promise<SettingsDto> {
    return this.userService.getSettings(userId);
  }
}
