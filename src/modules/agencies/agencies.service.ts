import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ILike } from 'typeorm';
import { UpdateAgenciesDto } from './dtos/update-agencies.dto';
import { AgenciesEntity } from './agencies.entity';
import { BasicService } from '../../generic/service';
import { CreateAgenciesDto } from './dtos/create-agencies.dto';
import { CGeneric } from '../../interfaces/res.generic.interface';

export class AgenciesService extends BasicService<
  AgenciesEntity,
  CreateAgenciesDto,
  UpdateAgenciesDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('agencies', AgenciesEntity, dataSource);
  }

  async findAllWithName(name: string): Promise<CGeneric> {
    const findAllData = await this.repository.find({
      where: {
        title: ILike(`%${name}%`),
      },
    });

    if (!findAllData.length) {
      return new CGeneric([`agencies not found`], 204, findAllData);
    }

    return new CGeneric([`agencies all data`], 200, findAllData);
  }
}
// @Injectable()
// export class AgenciesService {
//   constructor(
//     @InjectRepository(AgenciesEntity)
//     private AgenciesRepository: Repository<AgenciesEntity>,
//   ) {}

//   async createAgencies(
//     userId: Uuid,
//     createAgenciesDto: CreateAgenciesDto,
//   ): Promise<AgenciesEntity> {
//     createAgenciesDto.userId = userId;
//     const createdEvent: AgenciesEntity =
//       await this.AgenciesRepository.save(createAgenciesDto);
//     return createdEvent;
//   }

//   async getAllAgencies(
//     AgenciesPageOptionsDto: AgenciesPageOptionsDto,
//   ): Promise<PageDto<AgenciesDto>> {
//     const queryBuilder = this.AgenciesRepository.createQueryBuilder('Agencies');

//     const [items, pageMetaDto] =
//       await queryBuilder.paginate(AgenciesPageOptionsDto);

//     return items.toPageDto(pageMetaDto);
//   }

//   async getSingleAgencies(id: Uuid): Promise<AgenciesEntity> {
//     const queryBuilder = this.AgenciesRepository
//       .createQueryBuilder('Agencies')
//       .where('Agencies.id = :id', { id });

//     const AgenciesEntity = await queryBuilder.getOne();

//     if (!AgenciesEntity) {
//       throw new AgenciesNotFoundException();
//     }

//     return AgenciesEntity;
//   }

//   async updateAgencies(
//     id: Uuid,
//     updateAgenciesDto: UpdateAgenciesDto,
//   ): Promise<void> {
//     const queryBuilder = this.AgenciesRepository
//       .createQueryBuilder('Agencies')
//       .where('Agencies.id = :id', { id });

//     const AgenciesEntity = await queryBuilder.getOne();

//     if (!AgenciesEntity) {
//       throw new AgenciesNotFoundException();
//     }

//     await this.AgenciesRepository.merge(AgenciesEntity, updateAgenciesDto);

//     await this.AgenciesRepository.save(updateAgenciesDto);
//   }

//   async deleteAgencies(id: Uuid): Promise<void> {
//     const queryBuilder = this.AgenciesRepository
//       .createQueryBuilder('Agencies')
//       .where('Agencies.id = :id', { id });

//     const AgenciesEntity = await queryBuilder.getOne();

//     if (!AgenciesEntity) {
//       throw new AgenciesNotFoundException();
//     }

//     await this.AgenciesRepository.remove(AgenciesEntity);
//   }
// }
