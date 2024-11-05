import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	Repository,
} from "typeorm";

import { BookingsEntity } from "./bookings.entity";

@Injectable()
export class BookingRepository {
	constructor(
		@InjectRepository(BookingsEntity)
		private repository: Repository<BookingsEntity>,
	) {}

	count(options?: FindManyOptions<BookingsEntity>): Promise<number> {
		return this.repository.count(options);
	}

	create(entityLike: DeepPartial<BookingsEntity>): BookingsEntity {
		return this.repository.create(entityLike);
	}

	save(entity: BookingsEntity) {
		return this.repository.save(entity);
	}

	readAll(
		options?: FindManyOptions<BookingsEntity>,
	): Promise<BookingsEntity[]> {
		return this.repository.find(options);
	}

	readOne(
		options: FindOneOptions<BookingsEntity>,
	): Promise<BookingsEntity | null> {
		return this.repository.findOne(options);
	}

	merge(
		mergeIntoEntity: BookingsEntity,
		...entityLikes: DeepPartial<BookingsEntity>[]
	): BookingsEntity {
		return this.repository.merge(mergeIntoEntity, ...entityLikes);
	}

	delete(id: number) {
		return this.repository.delete(id);
	}
}
