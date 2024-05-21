import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { Slug } from '../common/utils/slug';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  dest: './uploads',
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      return cb(
        null,
        `${Slug.createFromText(file.originalname.split('.')[0]).value}-${Date.now()}${extname(file.originalname)}`,
      );
    },
  }),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb): unknown => {
    if (
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpg'
    ) {
      return cb(
        new BadRequestException('Invalid file type. image/png are supported.'),
        false,
      );
    }
    return cb(null, true);
  },
};
