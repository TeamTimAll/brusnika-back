import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, ILike } from "typeorm";

import { BasicService } from "../../generic/service";
import { ServiceResponse } from "../../interfaces/serviceResponse.interface";

import { AgencyEntity } from "./agencies.entity";
import { CreateAgenciesDto } from "./dtos/create-agencies.dto";
import { UpdateAgenciesDto } from "./dtos/update-agencies.dto";

export class AgencyService extends BasicService<
	AgencyEntity,
	CreateAgenciesDto,
	UpdateAgenciesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("agencies", AgencyEntity, dataSource);
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
