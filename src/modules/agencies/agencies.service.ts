import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, ILike } from "typeorm";

import { BasicService } from "../../generic/service";
import { ServiceResponse } from "../../interfaces/serviceResponse.interface";

import { AgenciesEntity } from "./agencies.entity";
import { CreateAgenciesDto } from "./dtos/create-agencies.dto";
import { UpdateAgenciesDto } from "./dtos/update-agencies.dto";

export class AgenciesService extends BasicService<
	AgenciesEntity,
	CreateAgenciesDto,
	UpdateAgenciesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("agencies", AgenciesEntity, dataSource);
	}

	async findAllWithName(name: string): Promise<ServiceResponse> {
		const findAllData = await this.repository.find({
			where: {
				title: ILike(`%${name}%`),
			},
		});

		if (!findAllData.length) {
			return new ServiceResponse(
				["agencies not found"],
				204,
				findAllData,
			);
		}

		return new ServiceResponse(["agencies all data"], 200, findAllData);
	}
}
// @Injectable()
// export class AgenciesService {
//   constructor(
//     @InjectRepository(AgenciesEntity)
//     private AgenciesRepository: Repository<AgenciesEntity>,
//   ) {}

//   async createAgencies(
//     userId: string,
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

//   async getSingleAgencies(id: string): Promise<AgenciesEntity> {
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
//     id: string,
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

//   async deleteAgencies(id: string): Promise<void> {
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
