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
  static async init(): Promise<HttpApplication> {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { cors: true },
    );
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());
    app.use(compression());
    app.use(morgan('combined'));
    app.enableVersioning();

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
      new HttpExceptionFilter(reflector),
      new QueryFailedFilter(reflector),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
        dismissDefaultMessages: true,
        exceptionFactory: (errors) => new UnprocessableEntityException(errors),
      }),
    );

    const port = ConfigManager.config.SERVER_PORT;
    await app.listen(port);
    console.info(`server running on ${await app.getUrl()}`);
    return app;
  }
}
