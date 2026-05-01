import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { put, del } from '@vercel/blob';

type ImageType = 'banner' | 'pb';

@Injectable()
export class FileStorageService {
    private readonly token: string;

    constructor(private readonly config: ConfigService) {
        const isDev = this.config.get<string>('NODE_ENV') === 'development';

        this.token = isDev
            ? this.config.getOrThrow<string>('BLOB_TOKEN_DEV')
            : this.config.getOrThrow<string>('BLOB_TOKEN_PROD');

        if (!this.token) {
            throw new Error('Missing Vercel Blob token');
        }
    }

    async uploadFile(file: Express.Multer.File, type: ImageType): Promise<string> {
        const filename = this.generateFileName(file.originalname);
        const path = `${type}/${filename}`;

        try {
            const blob = await put(path, file.buffer, {
                access: 'public',
                token: this.token,
                contentType: file.mimetype,
            });

            return blob.url;
        } catch (error) {
            console.error('Upload error:', error);
            throw new HttpException('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            await del(fileUrl, {
                token: this.token,
            });
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