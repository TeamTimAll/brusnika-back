import { Inject } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BasicService } from "../../generic/service";
import { PremisesEntity } from "../premises/premises.entity";
import { PremisesService } from "../premises/premises.service";

import { BookingsEntity } from "./bookings.entity";
import { NotBookedPremisesFilter } from "./dtos/NotBookedPremisesFilter.dto";
import { CreateBookingsDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";

export class BookingsService extends BasicService<
	BookingsEntity,
	CreateBookingsDto,
	UpdateBookingsDto
> {
	constructor(
		@InjectDataSource() dataSource: DataSource,
		@Inject() private premiseService: PremisesService,
	) {
		super("bookings", BookingsEntity, dataSource);
	}

	async r_findOne(id: string): Promise<BookingsEntity> {
		const findOne = await this.repository.findOne({
			where: { id },
		});

		if (!findOne) {
			throw new BookingNotFoundError(`'${id}' not found`);
		}

		return findOne;
	}

	async new_findAll(user: ICurrentUser): Promise<BookingsEntity[]> {
		return this.repository.find({
			where: { agent_id: user.user_id },
		});
	}

	readAllNotBookedPremises(
		filter: NotBookedPremisesFilter,
	): Promise<PremisesEntity[]> {
		let query = this.premiseService.repository
			.createQueryBuilder("p")
			.select("*")
			.where("id NOT IN (SELECT DISTINCT premise_id FROM bookings)");

		if (filter.type) {
			query = query.andWhere("p.type = :type", {
				type: filter.type,
			});
		}

		if (filter.building_id) {
			query = query.andWhere("p.building_id = :building_id", {
				building_id: filter.building_id,
			});
		}
		return query.getRawMany();
	}

	async r_update(
		id: string, // Assuming UUID is a string
		dto: UpdateBookingsDto,
		currentUser?: ICurrentUser,
	): Promise<BookingsEntity[]> {
		const foundCity = await this.r_findOne(id);

		if (!foundCity) {
			throw new BookingNotFoundError(" not found");
		}

		Object.assign(foundCity, dto, {
			updatedAt: new Date(),
			updatedBy: currentUser?.user_id,
		});

		const updatedData = await this.repository.save(foundCity);

		return [updatedData];
	}

	async r_remove(id: string): Promise<BookingsEntity[]> {
		const found = await this.r_findOne(id);
		await this.repository.delete(id);
		return [found];
	}
}
