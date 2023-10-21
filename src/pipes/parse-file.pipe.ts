import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class ParseFilePipe implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      throw new UnprocessableEntityException('Validation failed (file expected)');
    }

    if (Array.isArray(files) && files.length === 0) {
      throw new UnprocessableEntityException('Validation failed (file expected)');
    }

    return files;
  }
}
