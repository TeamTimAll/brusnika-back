import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { ConfigManager } from '../config';

export class OrmManager {
  static init() {
    const dataSource = new DataSource(ConfigManager.databaseConfig);

    initializeTransactionalContext();
    addTransactionalDataSource(dataSource);
  }
}
