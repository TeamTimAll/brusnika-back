import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BasicService } from "../../generic/service";

import { CreateVisitsDto } from "./dtos/create-visits.dto";
import { UpdateVisitsDto } from "./dtos/update-visits.dto";
import { VisitNotFoundError } from "./errors/VisitsNotFound.error";
import { VisitsEntity } from "./visits.entity";

export class VisitsService extends BasicService<
	VisitsEntity,
	CreateVisitsDto,
	UpdateVisitsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("visits", VisitsEntity, dataSource);
	}

	async new_findAll(user: ICurrentUser): Promise<VisitsEntity[]> {
		return this.repository.find({
			where: { agent_id: user.user_id },
		});
	}

	async r_findOne(id: number): Promise<VisitsEntity> {
		const findOne = await this.repository.findOne({
			where: { id },
		});

		if (!findOne) {
			throw new VisitNotFoundError(`'${id}' city not found`);
		}

		return findOne;
	}

	async r_update(
		id: number,
		dto: Partial<UpdateVisitsDto>,
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

	async r_remove(id: number): Promise<VisitsEntity[]> {
		const foundCity = await this.r_findOne(id);
		await this.repository.delete(id);
		return [foundCity];
	}
}
