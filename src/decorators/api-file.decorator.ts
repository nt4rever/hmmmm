import { fileMimetypeFilter } from '@filters/file-minetype.filter';
import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(
  filedName: string = 'file',
  required: boolean = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(filedName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [filedName]: {
            type: 'string',
            format: 'binary',
          },
        },
        required: required ? [filedName] : [],
      },
    }),
  );
}

export function ApiImageFile(filedName: string = 'file', required: boolean = false) {
  return ApiFile(filedName, required, {
    fileFilter: fileMimetypeFilter('image'),
  });
}
