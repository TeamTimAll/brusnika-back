import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BasicService } from "../../generic/service";

import { BookingsEntity } from "./bookings.entity";
import { CreateBookingsDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";

export class BookingsService extends BasicService<
	BookingsEntity,
	CreateBookingsDto,
	UpdateBookingsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
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
