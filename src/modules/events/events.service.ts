import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../../constants";
import { BasicService } from "../../generic/service";
import { UserNotFoundError } from "../../modules/user/errors/UserNotFound.error";
import { UserService } from "../../modules/user/user.service";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { FilterEventsDto } from "./dtos/events.dto";
import { AcceptInvitionDto as AcceptInvitationDto } from "./dtos/invite-users.dto";
import { LikeEventDto } from "./dtos/like-event.dto";
import { type UpdateEventsDto } from "./dtos/update-events.dto";
import { ContactEntity } from "./entities/contact.entity";
import { EventInvitationEntity } from "./entities/event-invition.entity";
import { EventLikesEntity } from "./entities/event-likes.entity";
import { EventViewsEntity } from "./entities/event-views.entity";
import { EventInvitationNotFoundError } from "./errors/EventInvitionNotFound.error";
import { EventReachedMaximumVisitorsError } from "./errors/EventReachedMaximumVisitors.error";
import { UserAlreadyRegisteredToEventError } from "./errors/UserAlreadyRegisteredToEvent.error";
import { EventsNotFoundError } from "./errors/events-not-found.error";
import { EventsEntity } from "./events.entity";

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
		@InjectRepository(EventInvitationEntity)
		private eventInvitationRepository: Repository<EventInvitationEntity>,
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
			.loadRelationCountAndMap(
				"e.accepted_invitation_count",
				"e.invited_users",
				"i",
				(qb) => {
					return qb.where("i.is_accepted IS TRUE");
				},
			)
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

	readAll(dto: FilterEventsDto, user: ICurrentUser) {
		let eventsQuery = this.repository
			.createQueryBuilder("e")
			.leftJoinAndSelect("e.contacts", "contacts")
			.leftJoinAndSelect("e.invited_users", "event_invition")
			.loadRelationCountAndMap(
				"e.accepted_invitation_count",
				"e.invited_users",
				"i",
				(qb) => {
					return qb.where("i.is_accepted IS TRUE");
				},
			)
			.loadRelationCountAndMap("e.likes_count", "e.likes")
			.loadRelationCountAndMap("e.views_count", "e.views");

		if (!dto.is_draft || user.role !== RoleType.ADMIN) {
			eventsQuery = eventsQuery.andWhere("e.is_draft IS FALSE");
		}
		if (dto.is_banner) {
			eventsQuery = eventsQuery.andWhere("e.is_banner IS TRUE");
		}
		if (dto.city_id) {
			eventsQuery = eventsQuery.andWhere("e.city_id = :city_id", {
				city_id: dto.city_id,
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

	async userEvents(user: ICurrentUser) {
		const foundInvitations = await this.eventInvitationRepository.find({
			select: { id: true, event_id: true },
			where: { user_id: user.user_id },
		});
		if (!foundInvitations) {
			throw new EventInvitationNotFoundError(`user_id: ${user.user_id}`);
		}
		const foundEvent = await this.repository
			.createQueryBuilder("e")
			.leftJoinAndSelect("e.contacts", "contacts")
			.loadRelationCountAndMap("e.likes_count", "e.likes")
			.loadRelationCountAndMap("e.views_count", "e.views")
			.loadRelationCountAndMap(
				"e.accepted_invitation_count",
				"e.invited_users",
				"i",
				(qb) => {
					return qb.where("i.is_accepted IS TRUE");
				},
			)
			.where("e.id in (:...id)", {
				id: foundInvitations.map((e) => e.event_id),
			})
			.getMany();
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${user.user_id}`);
		}
		return foundEvent;
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
			select: { id: true, max_visitors: true },
			where: {
				id: id,
			},
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${id}`);
		}
		const currentVisitors = await this.eventInvitationRepository.count({
			where: { event_id: id, user_id: In(userIds) },
		});
		if (foundEvent.max_visitors < currentVisitors + userIds.length) {
			throw new EventReachedMaximumVisitorsError(
				`${foundEvent.max_visitors} < ${currentVisitors + userIds.length}`,
			);
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
		const foundInvitations = await this.eventInvitationRepository.find({
			select: { id: true, user_id: true },
			where: {
				user_id: In(users.map((e) => e.id)),
				event_id: foundEvent.id,
			},
		});
		if (foundInvitations.length) {
			throw new UserAlreadyRegisteredToEventError(
				`user_ids: ${foundInvitations.map((e) => e.user_id).join(", ")}`,
			);
		}
		const invitations: EventInvitationEntity[] = [];
		users.forEach((u) => {
			invitations.push(
				this.eventInvitationRepository.create({
					user_id: u.id,
					event_id: foundEvent.id,
				}),
			);
		});
		return await this.eventInvitationRepository.save(invitations);
	}

	async deleteUserInvitation(id: number) {
		const foundInvitation = await this.eventInvitationRepository.findOne({
			select: { id: true },
			where: { id: id },
		});
		if (!foundInvitation) {
			throw new EventInvitationNotFoundError(`id: ${id}`);
		}
		await this.eventInvitationRepository.delete(foundInvitation.id);
		return foundInvitation;
	}

	async joinToEvent(event_id: number, user: ICurrentUser) {
		const foundEvent = await this.repository.findOne({
			select: { id: true, max_visitors: true },
			where: { id: event_id },
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${event_id}`);
		}
		const foundEventInvitation =
			await this.eventInvitationRepository.findOne({
				select: { id: true },
				where: { event_id: event_id, user_id: user.user_id },
			});
		if (foundEventInvitation) {
			throw new UserAlreadyRegisteredToEventError(
				`event_id: ${event_id}, user_id: ${user.user_id}`,
			);
		}
		const currentVisitors = await this.eventInvitationRepository.count({
			where: { event_id: event_id, user_id: user.user_id },
		});
		if (foundEvent.max_visitors < currentVisitors + 1) {
			throw new EventReachedMaximumVisitorsError(
				`${foundEvent.max_visitors} < ${currentVisitors + 1}`,
			);
		}
		const invitation = this.eventInvitationRepository.create({
			user_id: user.user_id,
			event_id: foundEvent.id,
		});
		return await this.eventInvitationRepository.save(invitation);
	}

	async acceptInvitation(dto: AcceptInvitationDto, user: ICurrentUser) {
		const foundEvent = await this.repository.findOne({
			select: { id: true },
			where: { id: dto.event_id },
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${dto.event_id}`);
		}
		const foundInvitation = await this.eventInvitationRepository.findOne({
			select: { id: true },
			where: { event_id: foundEvent.id, user_id: user.user_id },
		});
		if (!foundInvitation) {
			throw new EventInvitationNotFoundError(
				`event_id: ${foundEvent.id}, user_id: ${user.user_id}`,
			);
		}
		await this.eventInvitationRepository.update(foundInvitation.id, {
			is_accepted: dto.is_accepted,
		});
		foundInvitation.is_accepted = dto.is_accepted;
		return foundInvitation;
	}
}
