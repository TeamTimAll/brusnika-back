import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContactEntity } from "./contact.entity";
// import { ContactWorkScheduleEntity } from "./contact_work_schedule.entity";
import { ContactNotFoundError } from "./errors/ContactNotFound.error";

@Injectable()
export class ContactService {
	constructor(
		@InjectRepository(ContactEntity)
		private readonly contactRepository: Repository<ContactEntity>,
		// @InjectRepository(ContactWorkScheduleEntity)
		// private readonly contactWorkScheduleEntityRepository: Repository<ContactWorkScheduleEntity>,
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

	create() {
		//
	}

	update() {
		//
	}

	delete() {
		//
	}
}
