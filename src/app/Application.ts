import { ConfigManager } from '../config';
import { Http } from './http';
import { OrmManager } from './orm';
import { SwaggerManager } from './swagger';

export class Application {
  static async init() {
    ConfigManager.init();
    OrmManager.init();

    await Http.init();
    SwaggerManager.init(Http.app);
    await Http.listen();
  }
}
