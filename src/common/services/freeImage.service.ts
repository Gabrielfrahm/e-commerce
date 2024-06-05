import { UploadFileInterface } from '@common/interfaces/upload-file.interface';

import { createReadStream, unlinkSync } from 'node:fs';
import * as FormData from 'form-data';
import { Either, left, right } from '@common/utils/either';
import axios from 'axios';
import { ServiceException } from '@common/exceptions/service.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@config/service/config.service';

@Injectable()
export class FreeImageService implements UploadFileInterface {
  private readonly fileConfig: { url?: string; key?: string };
  constructor(private readonly config: ConfigService) {
    this.fileConfig = config.get('fileupload');
  }

  async uploadFile(filePath: string): Promise<Either<Error, string>> {
    const formData = new FormData();

    const fileStream = createReadStream(filePath);

    formData.append('source', fileStream);

    try {
      const response = await axios.post(`${this.fileConfig.url}`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        params: {
          key: `${this.fileConfig.key}`,
        },
      });

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
