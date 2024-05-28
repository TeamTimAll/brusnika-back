import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as mime from 'mime-types';
@Injectable()
export class FileUploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = mime.extension(file.mimetype);
      if (!fileExtension) {
        throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
      }

      const randomName: string =
        new Date().getTime().toString() + '.' + fileExtension;

      return randomName;
    } catch (error) {
      Logger.error('Error during file upload:', error);
      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
