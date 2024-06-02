import { InjectDataSource } from '@nestjs/typeorm';
import { BuildingsEntity } from './buildings.entity';
import { CreateBuilding } from '../buildings/dtos/building.create.dto';
import { UpdateBuilding } from '../buildings/dtos/building.update.dto';
import { BasicService } from '../../generic/service';
import { DataSource } from 'typeorm';

export class BuildingsService extends BasicService<
  BuildingsEntity,
  CreateBuilding,
  UpdateBuilding
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('buildings', BuildingsEntity, dataSource);
  }
}
