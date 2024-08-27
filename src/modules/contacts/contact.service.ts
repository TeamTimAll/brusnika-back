import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, In, Repository } from "typeorm";

import { CityService } from "../cities/cities.service";

import { ContactEntity } from "./contact.entity";
import { ContactAddressEntity } from "./contact_address.entity";
import { ContactWorkScheduleEntity } from "./contact_work_schedule.entity";
import {
	ContactBulkDto,
	CreateContactBulkDto,
	UpdateContactBulkDto,
} from "./dto/ContactBulk.dto";
import { CreateContactDto } from "./dto/CreateContact.dto";
import { ContactAddressNotFoundError } from "./errors/ContactAddressNotFound.error";
import { ContactNotFoundError } from "./errors/ContactNotFound.error";
import { ContactWorkScheduleNotFoundError } from "./errors/ContactWorkScheduleNotFound.error";

@Injectable()
export class ContactService {
	constructor(
		@InjectRepository(ContactEntity)
		private readonly contactRepository: Repository<ContactEntity>,
		@InjectRepository(ContactAddressEntity)
		private readonly contactAddressRepository: Repository<ContactAddressEntity>,
		@InjectRepository(ContactWorkScheduleEntity)
		private readonly contactWorkScheduleRepository: Repository<ContactWorkScheduleEntity>,
		@Inject()
		private readonly cityService: CityService,
		private dataSource: DataSource,
	) {}

	readAll(city_id?: number) {
		return this.contactRepository.find({
			relations: {
				address: true,
				work_schedule: true,
			},
			where: {
				city_id: city_id,
			},
		});
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
			address_link: dto.address_link,
			city_id: dto.city_id,
		});
		const newContact = await this.contactRepository.save(contact);
		dto.work_schedule = dto.work_schedule.map((w) => {
			w.contact_id = newContact.id;
			return w;
		});
		await this.contactWorkScheduleRepository.save(dto.work_schedule);
		return;
	}

	update() {
		//
	}

	delete() {
		//
	}

	async checkExsitsIds(ids: number[]) {
		const contact = await this.contactRepository.existsBy({ id: In(ids) });
		if (!contact) {
			throw new ContactNotFoundError(
				`'${ids.join(", ")}' city not found`,
			);
		}
	}

	async checkExsitsIdsManager(manager: EntityManager, ids: number[]) {
		const contact = await manager.existsBy(ContactEntity, { id: In(ids) });
		if (!contact) {
			throw new ContactNotFoundError(
				`'${ids.join(", ")}' city not found`,
			);
		}
	}

	async bulk(dto: ContactBulkDto): Promise<ContactBulkDto> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const createResult = await this.createBulk(
				queryRunner.manager,
				dto.create,
			);
			const updateResult = await this.updateBulk(
				queryRunner.manager,
				dto.update,
			);
			const deleteResult = await this.deleteBulk(
				queryRunner.manager,
				dto.delete,
			);
			await queryRunner.commitTransaction();
			return {
				create: createResult,
				update: updateResult,
				delete: deleteResult,
			};
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	async createBulk(
		manager: EntityManager,
		contacts: CreateContactBulkDto[],
	): Promise<CreateContactBulkDto[]> {
		if (!contacts.length) {
			return [];
		}
		const cityIds: Set<number> = new Set(contacts.map((e) => e.city_id));
		await this.cityService.checkExsitsIds([...cityIds]);
		const createdContacts: ContactEntity[] = [];
		contacts.forEach((c) => {
			const contact = this.contactRepository.create({
				title: c.title,
				phone_number: c.phone_number,
				address_link: c.address_link,
				city_id: c.city_id,
			});
			createdContacts.push(contact);
		});
		const newContacts = await manager.save(ContactEntity, createdContacts);
		const createdContactAddresses: ContactAddressEntity[] = [];
		const workSchedules: ContactWorkScheduleEntity[] = [];
		newContacts.forEach((c, i) => {
			contacts[i].work_schedule.forEach((w) => {
				const workSchedule =
					this.contactWorkScheduleRepository.create(w);
				workSchedule.contact_id = c.id;
				workSchedules.push(workSchedule);
			});
			const contactAddress = this.contactAddressRepository.create(
				contacts[i].address,
			);
			contactAddress.contact_id = c.id;
			createdContactAddresses.push(contactAddress);
		});
		const newWorkSchedules = await manager.save(
			ContactWorkScheduleEntity,
			workSchedules,
		);
		const newContactAddresses = await manager.save(
			ContactAddressEntity,
			createdContactAddresses,
		);
		const response: CreateContactBulkDto[] = [];
		newContacts.forEach((c, i) => {
			c.work_schedule = newWorkSchedules.filter(
				(w) => w.contact_id === c.id,
			);
			c.address = newContactAddresses[i];
			response.push(c);
		});
		return response;
	}

	async updateBulk(
		manager: EntityManager,
		contacts: UpdateContactBulkDto[],
	): Promise<UpdateContactBulkDto[]> {
		if (!contacts.length) {
			return [];
		}
		const contactIds: Set<number> = new Set(contacts.map((e) => e.id));
		const foundContacts = await manager.find(ContactEntity, {
			where: {
				id: In([...contactIds]),
			},
		});
		const foundContactIds: Set<number> = new Set(
			foundContacts.map((e) => e.id),
		);
		if (foundContactIds.size !== contactIds.size) {
			throw new ContactNotFoundError(
				`ids: ${[...contactIds, ...foundContactIds].join(", ")}`,
			);
		}
		const workScheduleIds: Set<number> = new Set(
			contacts.map((c) => c.work_schedule.map((w) => w.id)).flat(),
		);
		const foundWorkSchedule = await manager.find(
			ContactWorkScheduleEntity,
			{
				where: { id: In([...workScheduleIds]) },
			},
		);
		const foundWorkScheduleIds: Set<number> = new Set(
			foundWorkSchedule.map((e) => e.id),
		);
		if (foundWorkScheduleIds.size !== workScheduleIds.size) {
			throw new ContactWorkScheduleNotFoundError(
				`work schedule ids: '${[...workScheduleIds].join(", ")}'`,
			);
		}
		const contactAddressIds: Set<number> = new Set(
			contacts.map((e) => e.address.id),
		);
		const foundContactAddresses = await manager.find(ContactAddressEntity, {
			where: { id: In([...contactAddressIds]) },
		});
		const foundContactAddressIds: Set<number> = new Set(
			foundContactAddresses.map((e) => e.id),
		);
		if (foundContactAddressIds.size !== contactAddressIds.size) {
			throw new ContactAddressNotFoundError(
				`address ids: '${[...contactAddressIds].join(", ")}'`,
			);
		}
		const cityIds: Set<number> = new Set(contacts.map((e) => e.city_id));
		await this.cityService.checkExsitsIdsManager(manager, [...cityIds]);
		const mergedContacts: ContactEntity[] = [];
		foundContacts.forEach((e, i) => {
			mergedContacts.push(this.contactRepository.merge(e, contacts[i]));
		});
		const createdContacts = await manager.save(
			ContactEntity,
			mergedContacts,
		);
		const workSchedules: ContactWorkScheduleEntity[] = [];
		const mergedContactAddresses: ContactAddressEntity[] = [];
		createdContacts.forEach((_c, i) => {
			contacts[i].work_schedule.forEach((w, j) => {
				const workSchedule = this.contactWorkScheduleRepository.merge(
					foundWorkSchedule[j],
					w,
				);
				workSchedules.push(workSchedule);
			});
			const contactAddress = this.contactAddressRepository.merge(
				foundContactAddresses[i],
				contacts[i].address,
			);
			mergedContactAddresses.push(contactAddress);
		});
		const newWorkSchedules = await manager.save(
			ContactWorkScheduleEntity,
			workSchedules,
		);
		const newContactAddresses = await manager.save(
			ContactAddressEntity,
			mergedContactAddresses,
		);
		const response: UpdateContactBulkDto[] = [];
		createdContacts.forEach((c, i) => {
			c.work_schedule = newWorkSchedules.filter(
				(w) => w.contact_id === c.id,
			);
			c.address = newContactAddresses[i];
			response.push(c);
		});
		return response;
	}

	async deleteBulk(manager: EntityManager, ids: number[]): Promise<number[]> {
		if (!ids.length) {
			return [];
		}
		const contactIds: Set<number> = new Set(ids.map((e) => e));
		await this.checkExsitsIdsManager(manager, [...contactIds]);
		await manager.delete(ContactEntity, [...contactIds]);
		return [...contactIds];
	}
}
