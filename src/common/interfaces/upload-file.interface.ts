import { Either } from '@common/utils/either';

export interface UploadFileInterface {
  uploadFile(filePath: string): Promise<Either<Error, string>>;
  deleteFile(fileLink: string): Promise<string>;
}
