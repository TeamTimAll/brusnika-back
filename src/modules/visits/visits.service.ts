import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { Uuid } from "boilerplate.polyfill";
import { ICurrentUser } from "interfaces/current-user.interface";

import { BasicService } from "../../generic/service";

import { VisitsEntity } from "./visits.entity";
import { CreateVisitsDto } from "./dtos/create-visits.dto";
import { UpdateVisitsDto } from "./dtos/update-visits.dto";
import { VisitNotFoundError } from "./errors/VisitsNotFound.error";

export class VisitsService extends BasicService<
	VisitsEntity,
	CreateVisitsDto,
	UpdateVisitsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("visits", VisitsEntity, dataSource);
	}

	async r_findOne(id: Uuid): Promise<VisitsEntity> {
		const findOne = await this.repository.findOne({
			where: { id },
		});

		if (!findOne) {
			throw new VisitNotFoundError(`'${id}' city not found`);
		}

		return findOne;
	}

	async r_update(
		id: Uuid, // Assuming UUID is a string
		dto: UpdateVisitsDto,
		currentUser?: ICurrentUser,
	): Promise<VisitsEntity[]> {
		const foundCity = await this.r_findOne(id);

		if (!foundCity) {
			throw new VisitNotFoundError("city not found");
		}

		Object.assign(foundCity, dto, {
			updatedAt: new Date(),
			updatedBy: currentUser?.user_id,
		});

		const updatedData = await this.repository.save(foundCity);

		return [updatedData];
	}

	async r_remove(id: string): Promise<VisitsEntity[]> {
		const foundCity = await this.r_findOne(id);
		await this.repository.delete(id);
		return [foundCity];
	}
}
