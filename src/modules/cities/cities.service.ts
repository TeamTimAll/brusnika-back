import { DataSource, ILike } from 'typeorm';
import { CitiesEntity } from './cities.entity';
import { BasicService } from '../../generic/service';
import { UpdateCitiesDto } from './dtos/update-cities.dto';
import { CreateCitiesDto } from './dtos/create-cities.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { CGeneric } from '../../interfaces/res.generic.interface';

export class CitiesService extends BasicService<
  CitiesEntity,
  CreateCitiesDto,
  UpdateCitiesDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('cities', CitiesEntity, dataSource);
  }

  async findAllWithName(name: string): Promise<CGeneric> {
    const findAllData = await this.repository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });

    if (!findAllData.length) {
      return new CGeneric([`agencies not found`], 204, findAllData);
    }

    return new CGeneric([`agencies all data`], 200, findAllData);
  }
}
