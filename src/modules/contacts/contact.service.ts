import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CityService } from "../cities/cities.service";

import { ContactEntity } from "./contact.entity";
import { ContactWorkScheduleEntity } from "./contact_work_schedule.entity";
import { CreateContactDto } from "./dto/CreateContact.dto";
import { ContactNotFoundError } from "./errors/ContactNotFound.error";

@Injectable()
export class ContactService {
	constructor(
		@InjectRepository(ContactEntity)
		private readonly contactRepository: Repository<ContactEntity>,
		@InjectRepository(ContactWorkScheduleEntity)
		private readonly contactWorkScheduleEntityRepository: Repository<ContactWorkScheduleEntity>,
		@Inject()
		private readonly cityService: CityService,
	) {}

	readAll() {
		return this.contactRepository.find();
	}

	async readOne(id: number) {
		const foundContact = await this.contactRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundContact) {
			throw new ContactNotFoundError(`id: ${id}`);
		}
		return foundContact;
	}

	async create(dto: CreateContactDto) {
		await this.cityService.checkExsits(dto.city_id);
		const contact = this.contactRepository.create({
			title: dto.title,
			phone_number: dto.phone_number,
			address: dto.address,
			address_link: dto.address_link,
			email: dto.email,
			city_id: dto.city_id,
		});
		const newContact = await this.contactRepository.save(contact);
		dto.work_schedule = dto.work_schedule.map((w) => {
			w.contact_id = newContact.id;
			return w;
		});
		await this.contactWorkScheduleEntityRepository.save(dto.work_schedule);
		return;
	}

	update() {
		//
	}

	delete() {
		//
	}
}
