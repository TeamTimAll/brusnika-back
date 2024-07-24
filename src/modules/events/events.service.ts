import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BasicService } from "../../generic/service";
import { UserNotFoundError } from "../../modules/user/errors/UserNotFound.error";
import { UserService } from "../../modules/user/user.service";

import { ContactEntity } from "./contact.entity";
import { CreateEventsDto } from "./dtos/create-events.dto";
import { FilterEventsDto } from "./dtos/events.dto";
import { LikeEventDto } from "./dtos/like-event.dto";
import { type UpdateEventsDto } from "./dtos/update-events.dto";
import { EventInvitionEntity } from "./event-invition.entity";
import { EventLikesEntity } from "./event-likes.entity";
import { EventViewsEntity } from "./event-views.entity";
import { EventsEntity } from "./events.entity";
import { EventsNotFoundError } from "./exceptions/events-not-found.error";

interface EventLikedResponse {
	is_liked: boolean;
}

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
		@InjectRepository(EventLikesEntity)
		private eventLikesRepository: Repository<EventLikesEntity>,
		@InjectRepository(EventViewsEntity)
		private eventViewsRepository: Repository<EventViewsEntity>,
		@InjectRepository(EventInvitionEntity)
		private eventInvitionRepository: Repository<EventInvitionEntity>,
		@Inject()
		private userService: UserService,
	) {
		super("events", EventsEntity, dataSource);
	}

	async readOne(id: number, user: ICurrentUser) {
		const foundEvent = await this.repository
			.createQueryBuilder("e")
			.leftJoinAndSelect("e.contacts", "contacts")
			.loadRelationCountAndMap("e.likes_count", "e.likes")
			.loadRelationCountAndMap("e.views_count", "e.views")
			.where("e.id = :id", { id })
			.getOne();
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${id}`);
		}
		const isViewed = await this.eventViewsRepository.findOne({
			where: {
				event_id: id,
				user_id: user.user_id,
			},
		});
		if (!isViewed) {
			const eventViews = this.eventViewsRepository.create({
				event_id: id,
				user_id: user.user_id,
			});
			await this.eventViewsRepository.save(eventViews);
		}
		return foundEvent;
	}

	readAll(dto: FilterEventsDto) {
		let eventsQuery = this.repository
			.createQueryBuilder("e")
			.leftJoinAndSelect("e.contacts", "contacts")
			.leftJoinAndSelect("e.invited_users", "event_invition")
			.loadRelationCountAndMap("e.likes_count", "e.likes")
			.loadRelationCountAndMap("e.views_count", "e.views");
		if (dto.city_id) {
			eventsQuery = eventsQuery.andWhere("e.city_id = :city_id", {
				city: dto.city_id,
			});
		}
		if (dto.date) {
			eventsQuery = eventsQuery.andWhere("e.date = :date", {
				date: dto.date,
			});
		}
		if (dto.format) {
			eventsQuery = eventsQuery.andWhere("e.format = :format", {
				format: dto.format,
			});
		}
		if (dto.type) {
			eventsQuery = eventsQuery.andWhere("e.type = :type", {
				type: dto.type,
			});
		}
		return eventsQuery.getMany();
	}

	async createWithContacts(dto: CreateEventsDto) {
		const event = this.repository.create(dto);
		const newEvent = await this.repository.save(event);
		let contacts = this.contactsRepository.create(dto.contacts);
		contacts = contacts.map((e) => {
			e.event_id = event.id;
			return e;
		});
		newEvent.contacts = await this.contactsRepository.save(contacts);
		return newEvent;
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

	async toggleLike(
		body: LikeEventDto,
		user: ICurrentUser,
	): Promise<EventLikedResponse> {
		const event = await this.repository.findOne({
			where: {
				id: body.id,
			},
		});
		if (!event) {
			throw new EventsNotFoundError(`id: ${body.id}`);
		}
		const isLiked = await this.eventLikesRepository.findOne({
			select: { id: true },
			where: {
				event_id: event.id,
				user_id: user.user_id,
			},
		});
		if (isLiked) {
			await this.eventLikesRepository.delete(isLiked.id);
			return { is_liked: false };
		}
		const like = this.eventLikesRepository.create({
			event_id: event.id,
			user_id: user.user_id,
		});
		await this.eventLikesRepository.save(like);
		return { is_liked: true };
	}

	async inviteUsers(id: number, userIds: number[]) {
		const foundEvent = await this.repository.findOne({
			select: { id: true },
			where: {
				id: id,
			},
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${id}`);
		}
		const users = await this.userService.repository.find({
			select: { id: true },
			where: {
				id: In(userIds),
			},
		});
		if (!users.length) {
			throw new UserNotFoundError(`ids: ${userIds.join(", ")}`);
		}
		const invitions: EventInvitionEntity[] = [];
		users.forEach((u) => {
			invitions.push(
				this.eventInvitionRepository.create({
					user_id: u.id,
					event_id: foundEvent.id,
				}),
			);
		});
		return await this.eventInvitionRepository.save(invitions);
	}
}
