import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { chunkArray } from "../../lib/array";
import { FirebaseMessage, FirebaseService } from "../../lib/firebase";
import { LogColor, logColorize } from "../../lib/log";
import { UserEntity } from "../user/user.entity";

import { CreateNotificationDto } from "./dto/CreateNotification.dto";
import { NotificationFilterDto } from "./dto/NotificationFilter.dto";
import { UpdateNotificationDto } from "./dto/UpdateNotification.dto";
import { NotificationNotFoundError } from "./errors/NotificationNotFound.error";
import { NotificationEntity, NotificationType } from "./notification.entity";
import { NotificationUserEntity } from "./notification_user.entity";

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(NotificationEntity)
		private readonly notificationRepository: Repository<NotificationEntity>,
		@InjectRepository(NotificationUserEntity)
		private readonly notificationUserRepository: Repository<NotificationUserEntity>,
		private logger: Logger,
	) {}

	get repository(): Repository<NotificationEntity> {
		return this.notificationRepository;
	}

	async readAll(dto: NotificationFilterDto, user: ICurrentUser) {
		const pageSize = (dto.page - 1) * dto.limit;

		const query = this.notificationRepository
			.createQueryBuilder("n")
			.leftJoin(NotificationUserEntity, "nu", "nu.notification_id = n.id")
			.addSelect("nu.is_read AS n_is_read")
			.offset(pageSize)
			.limit(dto.limit)
			.orderBy("n.id", "DESC")
			.where("nu.user_id = :user_id", { user_id: user.user_id });

		query.leftJoinAndSelect(
			"events",
			"e",
			"e.id = n.object_id AND n.type IN (:...types)",
			{
				types: [
					NotificationType.EVENT,
					NotificationType.CREATED_EVENT,
					NotificationType.WARNING_EVENT,
				],
			},
		);

		query.select([
			"n.id AS id",
			"n.created_at AS created_at",
			"n.updated_at AS updated_at",
			"n.title AS title",
			"n.description AS description",
			"n.type AS type",
			"n.object_id AS object_id",
			"n.is_read AS is_read",
			"n.is_active AS is_active",
			"e.photo AS photo",
			"nu.user_id AS user_id",
		]);

		const results = await query.getRawMany();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return results;
	}

	async readOne(id: number): Promise<NotificationEntity> {
		const foundNotification = await this.notificationRepository.findOne({
			where: { id: id },
		});
		if (!foundNotification) {
			throw new NotificationNotFoundError(`id: ${id}`);
		}
		return foundNotification;
	}

	async readNotification(notification_id: number, user: ICurrentUser) {
		const foundNotification = await this.notificationUserRepository.findOne(
			{
				where: {
					notification_id: notification_id,
					user_id: user.user_id,
				},
			},
		);
		if (!foundNotification) {
			throw new NotificationNotFoundError(`id: ${notification_id}`);
		}
		await this.notificationUserRepository.update(foundNotification.id, {
			is_read: true,
		});
		foundNotification.is_read = true;
		return foundNotification;
	}

	async create(dto: CreateNotificationDto, user: ICurrentUser) {
		const notification = await this.notificationRepository.save(
			this.notificationRepository.create(dto),
		);
		await this.notificationUserRepository.save(
			this.notificationUserRepository.create({
				user_id: user.user_id,
				notification_id: notification.id,
			}),
		);
		if (user.firebase_token) {
			await FirebaseService.sendMessage({
				title: notification.title,
				message: notification.description ?? "",
				data: notification,
				token: user.firebase_token,
			});
		}
		return notification;
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

	async sendToUsers(
		userTokens: Array<Pick<UserEntity, "id" | "firebase_token">>,
		notification: Partial<NotificationEntity>,
	) {
		if (userTokens.length) {
			const chunkedUserTokens = chunkArray(userTokens, 500);

			const newNotification = await this.notificationRepository.save(
				this.notificationRepository.create(notification),
			);
			for await (const chunk of chunkedUserTokens) {
				const notificationUsers: NotificationUserEntity[] = [];
				chunk.forEach((u) => {
					notificationUsers.push(
						this.notificationUserRepository.create({
							user_id: u.id,
							notification_id: newNotification.id,
						}),
					);
				});

				await this.notificationUserRepository.save(notificationUsers, {
					chunk: 20,
				});

				await this.sendToFirebase(
					newNotification,
					chunk.map((e) => e.firebase_token),
				);
			}
		}
	}

	private async sendToFirebase(
		notification: NotificationEntity,
		userTokens: Array<string | null | undefined>,
	) {
		const firebaseMessages: FirebaseMessage<NotificationEntity>[] = [];
		userTokens.forEach((token) => {
			if (token) {
				firebaseMessages.push({
					title: notification.title,
					message: notification.description ?? "",
					data: notification,
					token: token,
				});
			}
		});
		if (firebaseMessages.length) {
			const response =
				await FirebaseService.sendMessageBulk(firebaseMessages);
			this.logger.log(
				`${logColorize(LogColor.GREEN_TEXT, "Success count:")} ${response.successCount}`,
			);
			this.logger.log(
				`${logColorize(LogColor.RED_TEXT, "Failure count:")} ${response.failureCount}`,
			);
		}
	}
}
