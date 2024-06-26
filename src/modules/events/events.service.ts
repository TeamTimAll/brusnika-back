import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { type UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsEntity } from "./events.entity";
import { EventsNotFoundException } from "./exceptions/events-not-found.exception";

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EventsEntity)
		private eventsRepository: Repository<EventsEntity>,
	) {}

	async createEvents(
		userId: string,
		createEventsDto: CreateEventsDto,
	): Promise<EventsEntity> {
		createEventsDto.userId = userId;
		const createdEvent: EventsEntity =
			await this.eventsRepository.save(createEventsDto);
		return createdEvent;
	}

	async getSingleEvents(id: string): Promise<EventsEntity> {
		const queryBuilder = this.eventsRepository
			.createQueryBuilder("Events")
			.where("Events.id = :id", { id });

		const EventsEntity = await queryBuilder.getOne();

		if (!EventsEntity) {
			throw new EventsNotFoundException();
		}

		return EventsEntity;
	}

	async updateEvents(
		id: string,
		updateEventsDto: UpdateEventsDto,
	): Promise<void> {
		const queryBuilder = this.eventsRepository
			.createQueryBuilder("Events")
			.where("Events.id = :id", { id });

		const EventsEntity = await queryBuilder.getOne();

		if (!EventsEntity) {
			throw new EventsNotFoundException();
		}

		await this.eventsRepository.merge(EventsEntity, updateEventsDto);

		await this.eventsRepository.save(updateEventsDto);
	}

	async deleteEvents(id: string): Promise<void> {
		const queryBuilder = this.eventsRepository
			.createQueryBuilder("Events")
			.where("Events.id = :id", { id });

		const EventsEntity = await queryBuilder.getOne();

		if (!EventsEntity) {
			throw new EventsNotFoundException();
		}

		await this.eventsRepository.remove(EventsEntity);
	}

	async updateEventLike(id: string): Promise<void> {
		const queryBuilder = await this.eventsRepository
			.createQueryBuilder("Events")
			.where("Events.id = :id", { id });

		const event = await queryBuilder.getOne();

		if (!event) {
			throw new EventsNotFoundException();
		}

		event.likeCount++;
		await this.eventsRepository.save(event);
	}

	async updateEventView(id: string): Promise<void> {
		const queryBuilder = await this.eventsRepository
			.createQueryBuilder("Events")
			.where("Events.id = :id", { id });

		const event = await queryBuilder.getOne();

		if (!event) {
			throw new EventsNotFoundException();
		}

		event.views++; // Increment view count
		await this.eventsRepository.save(event);
	}
}
