import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    const isAllowedType = file.mimetype.match(/^(image\/jpeg|image\/png)$/);
    const isFileSizeOk = file.size <= 2 * 1024 * 1024; // 2MB

    if (!isAllowedType || !isFileSizeOk) {
      let errorMessage = 'Invalid file.';
      if (!isAllowedType) {
        errorMessage = 'Only JPEG and PNG files are allowed.';
      } else if (!isFileSizeOk) {
        errorMessage = 'File size exceeds 2MB.';
      }

      throw new BadRequestException(errorMessage);
    }

    return file;
  }
}
