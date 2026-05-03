import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { put, del } from '@vercel/blob';
import { ImageType } from './types/image-type';
import type { Express } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Multer } from 'multer';

@Injectable()
export class BlobService {
  private readonly token: string;

  constructor(private readonly config: ConfigService) {
    this.token = this.config.getOrThrow<string>('BLOB_TOKEN');
  }

  async uploadFile(
    file: Express.Multer.File,
    type: ImageType,
  ): Promise<string> {
    const filename = this.generateFileName(file.originalname);
    const path = `${type}/${filename}`;

    const blob = await put(path, file.buffer, {
      access: 'public',
      token: this.token,
      contentType: file.mimetype,
    });

    return blob.url;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      await del(fileUrl, { token: this.token });
    } catch (error) {
      console.error('Delete error:', error);
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const safeName = originalName.replace(/\s+/g, '-');
    return `${timestamp}-${safeName}`;
  }
}
