import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class FileStorageService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('DO_SPACE_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('DO_SPACE_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'DO_SPACE_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.get<string>('DO_SPACES_ENDPOINT'),
      forcePathStyle: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    imgType: 'pb' | 'banner',
  ): Promise<string> {
    const newFilename = `${Date.now()}-${file.originalname}`;
    const env: string = this.configService.get<string>('NODE_ENV');
    let changeBucketWhenLocal = 'dev-';
    if (env !== 'development') {
      changeBucketWhenLocal = '';
    }
    const command = new PutObjectCommand({
      Bucket: changeBucketWhenLocal + imgType,
      Key: newFilename,
      Body: file.buffer,
      ACL: 'public-read',
    });

    try {
      await this.s3Client.send(command);
      return (
        this.configService.get<string>('DO_SPACES_CDN_ENDPOINT') +
        '/' +
        changeBucketWhenLocal +
        imgType +
        '/' +
        encodeURI(newFilename)
      );
    } catch (error) {
      console.error('Error uploading file to DigitalOcean Spaces: ', error);
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(oldUrl: string, imgType: string): Promise<void> {
    const url = new URL(oldUrl);
    const key = decodeURI(url.pathname.split('/').pop());

    if (!key) {
      console.error('Error extracting key from URL:', oldUrl);
      return;
    }

    const env: string = this.configService.get<string>('NODE_ENV');
    let changeBucketWhenLocal = 'dev-';
    if (env !== 'development') {
      changeBucketWhenLocal = '';
    }

    const command = new DeleteObjectCommand({
      Bucket: changeBucketWhenLocal + imgType,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting old file from DigitalOcean Spaces:', error);
    }
  }
}
