import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png'];
  private readonly maxSize = 2 * 1024 * 1024; // 2MB

  transform(file: Express.Multer.File | undefined): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    const isAllowedType = this.allowedMimeTypes.includes(file.mimetype);
    const isFileSizeOk = file.size <= this.maxSize;

    if (!isAllowedType || !isFileSizeOk) {
      if (!isAllowedType) {
        throw new BadRequestException('Only JPEG and PNG files are allowed.');
      }

      if (!isFileSizeOk) {
        throw new BadRequestException('File size exceeds 2MB.');
      }
    }

    return file;
  }
}
