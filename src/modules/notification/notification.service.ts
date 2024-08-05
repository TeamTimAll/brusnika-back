import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateNotificationDto } from "./dto/CreateNotification.dto";
import { NotificationFilterDto } from "./dto/NotificationFilter.dto";
import { UpdateNotificationDto } from "./dto/UpdateNotification.dto";
import { NotificationNotFoundError } from "./errors/NotificationNotFound.error";
import { NotificationEntity } from "./notification.entity";

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(NotificationEntity)
		private readonly notificationRepository: Repository<NotificationEntity>,
	) {}

	get repository(): Repository<NotificationEntity> {
		return this.notificationRepository;
	}

	readAll(dto: NotificationFilterDto): Promise<NotificationEntity[]> {
		const pageSize = (dto.page - 1) * dto.limit;
		return this.notificationRepository
			.createQueryBuilder("n")
			.offset(pageSize)
			.limit(dto.limit)
			.orderBy("n.id", "DESC")
			.getMany();
	}

	async readOne(id: number): Promise<NotificationEntity> {
		const foundNotification = await this.notificationRepository.findOne({
			where: { id: id },
		});
		if (!foundNotification) {
			throw new NotificationNotFoundError(`id: ${id}`);
		}
		await this.notificationRepository.update(foundNotification.id, {
			is_read: true,
		});
		foundNotification.is_read = true;
		return foundNotification;
	}

	create(dto: CreateNotificationDto) {
		const notification = this.notificationRepository.create(dto);
		return this.notificationRepository.save(notification);
	}

	async update(id: number, dto: UpdateNotificationDto) {
		const foundNotification = await this.readOne(id);
		const mergedNotification = this.notificationRepository.merge(
			foundNotification,
			dto,
		);
		return this.notificationRepository.save(mergedNotification);
	}

	async delete(id: number) {
		const foundNotification = await this.readOne(id);
		await this.notificationRepository.delete(foundNotification.id);
		return foundNotification;
	}
}
