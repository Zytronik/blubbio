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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { UsernameAvailabilityRequestDto } from './dto/username-availability-request.dto';
import { UpdateProfileImageResponseDto } from './dto/update-profile-image-response.dto';
import { SaveSettingsResponseDto } from './dto/save-settings-response.dto';
import { SettingsDto } from './dto/settings.dto';
import { ValidateImagePipe } from './pipes/validate-image.pipe';
import { GetUserRatingResponseDto } from './dto/get-user-rating.response.dto';
import { GetUserProfileResponseDto } from './dto/get-user-profile.response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('username-available')
  @ApiOperation({ summary: 'Check if username is available' })
  @ApiOkResponse({ type: Boolean })
  async isUsernameAvailable(
    @Query() query: UsernameAvailabilityRequestDto,
  ): Promise<boolean> {
    return this.userService.isUsernameAvailable(query.username);
  }

  @Post(':id/profile-picture')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UpdateProfileImageResponseDto })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Param('id') userId: string,
    @UploadedFile(new ValidateImagePipe()) file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    return this.userService.updateProfilePicture(userId, file);
  }

  @Post(':id/profile-banner')
  @ApiOperation({ summary: 'Upload profile banner' })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UpdateProfileImageResponseDto })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileBanner(
    @Param('id') userId: string,
    @UploadedFile(new ValidateImagePipe()) file: Express.Multer.File,
  ): Promise<UpdateProfileImageResponseDto> {
    return this.userService.updateProfileBanner(userId, file);
  }

  @Post(':id/settings')
  @ApiOperation({ summary: 'Save user settings' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse()
  async saveSettings(
    @Param('id') userId: string,
    @Body() dto: SettingsDto,
  ): Promise<void> {
    return this.userService.saveSettings(userId, dto);
  }

  @Get(':id/settings')
  @ApiOperation({ summary: 'Get user settings' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: String })
  async getSettings(@Param('id') userId: string): Promise<string> {
    return this.userService.getSettings(userId);
  }

  @Get(':id/rating')
  @ApiOperation({ summary: 'Get user rating info' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: GetUserRatingResponseDto })
  async getUserRating(
    @Param('id') userId: string,
  ): Promise<GetUserRatingResponseDto> {
    return this.userService.getUserRating(userId);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get full user profile' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: GetUserProfileResponseDto })
  async getUserProfile(
    @Param('id') userId: string,
  ): Promise<GetUserProfileResponseDto> {
    return this.userService.getUserProfile(userId);
  }
}