import { UploadFileInterface } from '@common/interfaces/upload-file.interface';

import { createReadStream, unlinkSync } from 'node:fs';
import * as FormData from 'form-data';
import { Either, left, right } from '@common/utils/either';
import axios from 'axios';
import { ServiceException } from '@common/exceptions/service.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FreeImageService implements UploadFileInterface {
  async uploadFile(filePath: string): Promise<Either<Error, string>> {
    const formData = new FormData();

    const fileStream = createReadStream(filePath);

    formData.append('source', fileStream);

    try {
      const response = await axios.post(
        `${process.env.FILE_UPLOAD_URL}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          params: {
            key: `${process.env.FILE_UPLOAD_KEY}`,
          },
        },
      );

      const data = await response.data;

      // Apagar o arquivo local após o upload
      unlinkSync(filePath);

      if (data.success) {
        return right(data.image.url);
      } else {
        return left(
          new ServiceException('Failed to upload image to FreeImage', 400),
        );
      }
    } catch (error) {
      unlinkSync(filePath);
      return left(
        new ServiceException('Failed to upload image to FreeImage', 400),
      );
    }
  }

  deleteFile(fileLink: string): Promise<string> {
    throw new Error(`Method not implemented. ${fileLink}`);
  }
}
