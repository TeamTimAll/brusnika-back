import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as mime from 'mime-types';
import 'firebase/compat/storage';
import * as admin from 'firebase-admin';
@Injectable()
export class FileUploadService {
  // private readonly storage = admin.storage();
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = mime.extension(file.mimetype);
      if (!fileExtension) {
        throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
      }

      const randomName: string =
        new Date().getTime().toString() + '.' + fileExtension;

      const storage = admin.storage();
      const bucket = storage.bucket('gs://niyozneo.appspot.com');
      const fileUpload = bucket.file(randomName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise<string>((resolve, reject) => {
        stream.on('error', (error) => reject(error));
        stream.on('finish', () => resolve(randomName));
        stream.end(file.buffer);
      });

      // return randomName;
    } catch (error) {
      Logger.error('Error during file upload:', error);
      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// const uploadDir: string = path.join(process.cwd(), 'uploads');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const randomName: string =
//   new Date().getTime().toString() + '.' + fileExtension;
// const filePath: string = path.join(uploadDir, randomName);

// fs.writeFileSync(filePath, file.buffer);

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

// Initialize Firebase
// const firebaseConfig = {
//   // apiKey: 'API_KEY',
//   authDomain: 'niyozneo.firebaseapp.com',
//   projectId: 'niyozneo',
//   storageBucket: '[gs://niyozneo.appspot.com]',
// };
// admin.initializeApp(firebaseConfig);

// const firebaseConfig = {
//   // apiKey: 'API_KEY',
//   type: 'service_account',
//   project_id: 'niyozneo',
//   private_key_id: 'b149bf96562c7b86b356b708259a645419d7d9d4',
//   private_key:
//     '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCu7a9nEgMXpdqW\n25vmU4Z9FarNOgvaa6sjLe9xebXyMKJ3hWgxSOux3Ymxb6sg+OtmW+e9QoY3GvEK\nym2NtoD7V7FsJRbAzQlYbx3OudDefIHoFNfu3UQ4+R/uv96iLP+60VrqZai2VqJc\nrMNboR6RTn45yjLJz6AlS7z4ck5okvwep/n8hGAPTGboe12O0yRwA4wipNrwWxHA\nnN+Wx62GpYucfkLI6lNqxQ47b60TzpUqj3y395cIK0W/6V6Ek+trTc5x1I0kesH3\nJVISDVq/pbds4Ye/FCMTyje5eYwHR1srAtIXR2/eltf7ieiGc/iLJuS68Eu8yfEd\nxc/kTsJhAgMBAAECggEACNkGMLyaLhB2LgBTekbWIAZoGEdn5TNCEaZjlJnxLkvg\nEtMrSAdh/wIHYnN1TJaUiv3J6tJmIRxGbfsbR5JAI75dr6xwUj4Iq4m6wGuY/UDf\nTfica6Uyy74ri58WLN4hbO7FBkMwMXFQNudo3e4IQpWdmDESSK99EFfcafVXoo27\nudEMhf1j3cY9DNJRNFlPdYcQhHyQ5UFMxMQq0qZqDXZI7EbhzQQ6UNEF+EsYoauj\n/1WBQEK9I2IUsmyoclrXluhn3BThF3/QRKz8yHWG2RLF7aysaR1Q0AuWJF0fIlw7\nbeWEpq/V8ne2d8peZarvXOL7lxwfOUImwLryzf/oUQKBgQDhuCURsDQEp5A901ih\nuEs0vjlLl9qI/LA3q/HqC11n5Un7ZbwehLm8qkDjbpU0uL6sM+96ViL7x9DF0SMf\naABUd2JzHPX6qj8FsOgd44AHGCqdPQAjIVMcBsAhfaFViHaKPfSq+pzfIgi8zf9y\nxxFf62XiV3mYKu4dTqqAi01TMQKBgQDGZTwzuUuw49RJ8FxZdtpHAT4T60lVHhgy\nYdz97au8qhUnXGh7ebtDCX2sHEEZVC6mEglPOBWI9AFaE1gLtHuxCXT9/dGPZwtd\nUm+eSgMVD9xzDsF58qUmDMMtEsMxNh6gT1uF49nOBL9EeJiVTXJR0ZfWndoPVP4V\nGw94ze22MQKBgHNZGkBuzjZutuyRW6LRPkWGzFrQEFKe5yKcEPUst6AHcYYyWC80\nXoKGcsCG22Lk4jO4GrJm4FvQoeTlWlCLYlfH5pyy+RUO+UPcQtI7V0rI08YkzTQm\nrIUPAhJbVB4UrZc50BWsGoyApPxvPRKXnk5pSlifoTjc/3AkqkckaPCRAoGAQOBk\nAmoKlWq7Rf6CxIK4OFXwreTYEyyHLxqPgL4S1dwslLWEOTSChxZ4cSrAIv9DTe1B\n/BTT/fgE5SbEOPepJyh3iINS3vkMX1UQyQtc3KtWJI3juPQfC0VLIdcr21DeTQAG\nZs8ur08gGMzy4If15UmLxJPT9gWOHOq/cXqtzFECgYBd51GsFJ+TuL1Njq8Yq+Jg\n+WbiVyHPu9c/5QPx/4sKNJWNx8Mv7TlxLA2k0yMJ6MTawr6UiST1/NtInPJnJzUf\nzZTzszZM97vM+2aU3EPS8VfAeheRi9zXJTZcu8oCW9r0/ZboQ9Uk52VVagrnxacH\nuXWdGCsq4K9hXNVrVvpumQ==\n-----END PRIVATE KEY-----\n',
//   client_email:
//     'firebase-adminsdk-crnla@niyozneo.iam.gserviceaccount.com',
//   client_id: '117984944893766316482',
//   auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//   token_uri: 'https://oauth2.googleapis.com/token',
//   auth_provider_x509_cert_url:
//     'http                s://www.googleapis.com/oauth2/v1/certs',
//   client_x509_cert_url:
//     'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-crnla%40niyozneo.iam.gserviceaccount.com',
//   universe_domain: 'googleapis.com',
//   authDomain: 'niyozneo.firebaseapp.com',
//   projectId: 'niyozneo',
//   storageBucket: '[gs://niyozneo.appspot.com]',
// };
