import { DataSource } from 'typeorm';
import { SectionsEntity } from './sections.entity';
import { BasicService } from '../../generic/service';
import { UpdateSectionsDto } from './dtos/update-sections.dto';
import { CreateSectionsDto } from './dtos/create-sections.dto';
import { InjectDataSource } from '@nestjs/typeorm';

export class SectionsService extends BasicService<
  SectionsEntity,
  CreateSectionsDto,
  UpdateSectionsDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('Sections', SectionsEntity, dataSource);
  }
}
