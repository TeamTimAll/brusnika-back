import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { BasicService } from "../../generic/service";

import { ContactEntity } from "./contact.entity";
import { CreateEventsDto } from "./dtos/create-events.dto";
import { FilterEventsDto } from "./dtos/events.dto";
import { type UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsEntity } from "./events.entity";
import { EventsNotFoundError } from "./exceptions/events-not-found.error";

@Injectable()
export class EventsService extends BasicService<
	EventsEntity,
	CreateEventsDto,
	UpdateEventsDto
> {
	constructor(
		@InjectDataSource() dataSource: DataSource,
		@InjectRepository(ContactEntity)
		private contactsRepository: Repository<ContactEntity>,
	) {
		super("events", EventsEntity, dataSource);
	}

	readOne(id: number) {
		return this.repository.findOne({
			relations: {
				contacts: true,
			},
			where: {
				id: id,
			},
		});
	}

	readAll(dto: FilterEventsDto) {
		return this.repository.find({
			relations: {
				contacts: true,
			},
			where: {
				city_id: dto.city_id,
				type: dto.type,
				format: dto.format,
			},
		});
	}

	createWithContacts(dto: CreateEventsDto) {
		const event = this.repository.create(dto);
		return this.repository.save(event).then(async (e) => {
			let contacts = this.contactsRepository.create(dto.contacts);
			contacts = contacts.map((e) => {
				e.event_id = event.id;
				return e;
			});

			e.contacts = await this.contactsRepository.save(contacts);
			return e;
		});
	}

	async updateWithContacts(id: number, dto: UpdateEventsDto) {
		const foundEvent = await this.repository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${id}`);
		}
		const mergedEvent = this.repository.merge(foundEvent, dto);
		return await this.repository.save(mergedEvent);
	}
}
