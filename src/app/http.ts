import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from '../app.module';
import { ConfigManager } from '../config';
import { HttpExceptionFilter } from '../filters/bad-request.filter';
import { QueryFailedFilter } from '../filters/query-failed.filter';

export type HttpApplication = NestExpressApplication;

export class Http {
  public static app: HttpApplication;

  static async init(): Promise<Http> {
    this.app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { cors: true },
    );
    this.app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(morgan('combined'));
    this.app.enableVersioning();

    const reflector = this.app.get(Reflector);

    this.app.useGlobalFilters(
      new HttpExceptionFilter(reflector),
      new QueryFailedFilter(reflector),
    );

    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
        dismissDefaultMessages: true,
        exceptionFactory: (errors) => new UnprocessableEntityException(errors),
      }),
    );

    return this;
  }

  static async listen() {
    const port = ConfigManager.config.SERVER_PORT;
    await this.app.listen(port);
    console.info(`server running on ${await this.app.getUrl()}`);
  }
}
