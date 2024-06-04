import { ConfigManager } from '../config';
import { Http } from './http';
import { OrmManager } from './orm';

export class Application {
  static async init() {
    ConfigManager.init();
    OrmManager.init();
    await Http.init();
  }
}
