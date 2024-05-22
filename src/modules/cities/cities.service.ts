import { DataSource } from 'typeorm';
import { CitiesEntity } from './cities.entity';
import { BasicService } from '../../generic/service';
import { UpdateCitiesDto } from './dtos/update-cities.dto';
import { CreateCitiesDto } from './dtos/create-cities.dto';
import { InjectDataSource } from '@nestjs/typeorm';

export class CitiesService extends BasicService<
  CitiesEntity,
  CreateCitiesDto,
  UpdateCitiesDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('cities', CitiesEntity, dataSource);
  }
}
