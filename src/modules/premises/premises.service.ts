import { DataSource } from 'typeorm';
import { PremisesEntity } from './premises.entity';
import { BasicService } from '../../generic/service';
import { UpdatePremisesDto } from './dtos/update-premises.dto';
import { CreatePremisesDto } from './dtos/create-premises.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { PremisesFilterDto } from './dtos/premises.dto';

export class PremisesService extends BasicService<
  PremisesEntity,
  CreatePremisesDto,
  UpdatePremisesDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('premises', PremisesEntity, dataSource);
  }

  async getPremisesFiltered(
    filter?: PremisesFilterDto,
  ): Promise<PremisesEntity[]> {
    console.log('hi');
    
    let query = this.repository
      .createQueryBuilder('premise')
      .leftJoin('premise.building', 'building')
      .leftJoin('building.project', 'project');
    if (filter) {
      if (filter.endYear) {
        query = query.where('project.end_date = :endYear', {
          endYear: filter.endYear,
        });
      }

      if (filter.type) {
        query = query.where('premise.type = :value', {
          value: filter.type,
        });
      }

      if (filter.section_id) {
        query = query.where('building.section_id = :value', {
          value: filter.section_id,
        });
      }

      if (filter.rooms) {
        query = query.where('premise.rooms = :value', {
          value: filter.rooms,
        });
      }

      if (filter.project_id) {
        query = query.where('building.project_id = :value', {
          value: filter.project_id,
        });
      }

      if (filter.building_id) {
        query = query.where('premise.building_id = :value', {
          value: filter.building_id,
        });
      }

      if (filter.building_id) {
        query = query.where('premise.building_id = :value', {
          value: filter.building_id,
        });
      }

      if (filter.min_size) {
        query = query.where('premise.size => :value', {
          value: filter.min_size,
        });
      }

      if (filter.max_size) {
        query = query.where('premise.size <= :value', {
          value: filter.max_size,
        });
      }

      if (filter.min_floor) {
        query = query.where('premise.floor => :value', {
          value: filter.min_floor,
        });
      }

      if (filter.max_floor) {
        query = query.where('premise.floor <= :value', {
          value: filter.max_floor,
        });
      }

      if (filter.min_number) {
        query = query.where('premise.number => :value', {
          value: filter.min_number,
        });
      }

      if (filter.max_number) {
        query = query.where('premise.number <= :value', {
          value: filter.max_number,
        });
      }

      if (filter.min_price) {
        query = query.where('premise.price => :value', {
          value: filter.min_price,
        });
      }

      if (filter.max_price) {
        query = query.where('premise.price <= :value', {
          value: filter.max_price,
        });
      }

      if (filter.status) {
        query = query.where('premise.status = :value', {
          value: filter.status,
        });
      }
    }

    const premises = await query.getMany();

    return premises;
  }
}
