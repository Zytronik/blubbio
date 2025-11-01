import { UserService } from './user.service';
import { CheckUsernameDto } from 'src/_dto/auth.checkUsername';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from 'src/_interface/authRequest';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { ValidateImagePipe } from './validateImgPipeline';
import { SaveSettingsDto } from 'src/_dto/user.saveSettings';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('usernameIsValid')
  async checkUsernameIsValid(@Query() checkUsernameDto: CheckUsernameDto) {
    return await this.userService.userExists(checkUsernameDto.username);
  }

  @Post('updateProfilePic')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  async updateProfilePicture(
    @UploadedFile(new ValidateImagePipe()) file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const userId = req.user.userId;
    await this.userService.updateProfileImgs(userId, file, 'pb');
    return { message: 'Profile picture updated successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateProfileBanner')
  @UseInterceptors(FileInterceptor('profile_banner'))
  async updateProfileBanner(
    @UploadedFile(new ValidateImagePipe()) file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const userId = req.user.userId;
    await this.userService.updateProfileImgs(userId, file, 'banner');
    return { message: 'Banner updated successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('settings/save')
  async updateSettings(
    @Req() req: AuthenticatedRequest,
    @Body() settings: SaveSettingsDto,
  ) {
    const userId = req.user.userId;
    const stringifySettings = JSON.stringify(settings);

    await this.userService.updateUserSettings(userId, stringifySettings);
  }

  @UseGuards(JwtAuthGuard)
  @Get('settings/save')
  async getSettings(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.userService.getUserSettings(userId);
  }
}
