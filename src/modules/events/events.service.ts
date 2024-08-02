import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../../constants";
import { calcPagination } from "../../lib/pagination";
import { AgencyService } from "../../modules/agencies/agencies.service";
import { AgencyNotFoundError } from "../../modules/agencies/errors/AgencyNotFound.error";
import { CityService } from "../../modules/cities/cities.service";
import { UserNotFoundError } from "../../modules/user/errors/UserNotFound.error";
import { UserService } from "../../modules/user/user.service";
import { ServiceResponse } from "../../types";
import { AgencyEntity } from "../agencies/agencies.entity";
import { CitiesEntity } from "../cities/cities.entity";
import { UserEntity } from "../user/user.entity";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { FilterEventsDto, QueryType } from "./dtos/events.dto";
import {
	AcceptInvitionDto as AcceptInvitationDto,
	InviteUsersDto,
} from "./dtos/invite-users.dto";
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

export interface LikedResponse {
	is_liked: boolean;
}

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EventsEntity)
		private eventRepository: Repository<EventsEntity>,
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
		@Inject()
		private agenciesService: AgencyService,
		@Inject()
		private citiesService: CityService,
	) {}

	get repository() {
		return this.eventRepository;
	}

	async readOne(id: number, user: ICurrentUser) {
		const foundEvent = await this.eventRepository
			.createQueryBuilder("e")
			.leftJoinAndMapMany(
				"e.contacts",
				ContactEntity,
				"contacts",
				"contacts.event_id = e.id",
			)
			.leftJoinAndMapMany(
				"e.invited_users",
				EventInvitationEntity,
				"invitation",
				"invitation.event_id = e.id",
			)
			.leftJoinAndMapOne(
				"invitation.user",
				UserEntity,
				"user",
				"user.id = invitation.user_id",
			)
			.leftJoinAndMapOne(
				"user.agency",
				AgencyEntity,
				"agency",
				"agency.id = user.agency_id",
			)
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
			.select([
				"e.id",
				"e.is_liked",
				"e.is_joined",
				"e.title",
				"e.description",
				"e.photo",
				"e.location",
				"e.date",
				"e.start_time",
				"e.end_time",
				"e.leader",
				"e.max_visitors",
				"e.phone",
				"e.format",
				"e.type",
				"e.is_banner",
				"e.is_draft",
				"e.tags",
				"contacts.id",
				"contacts.fullname",
				"contacts.phone",
				"invitation.id",
				"invitation.is_accepted",
				"user.id",
				"user.avatar",
				"user.fullName",
				"agency.id",
				"agency.title",
			])
			.addSelect("to_char(e.start_time, 'HH24:MI') AS e_start_time")
			.addSelect("to_char(e.end_time, 'HH24:MI') AS e_end_time")
			.setParameter("user_id", user.user_id)
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

	async readAll(dto: FilterEventsDto, user: ICurrentUser) {
		const pageSize = (dto.page - 1) * dto.limit;
		let eventsQuery = this.eventRepository
			.createQueryBuilder("e")
			.leftJoinAndMapMany(
				"e.contacts",
				ContactEntity,
				"contacts",
				"contacts.event_id = e.id",
			)
			.leftJoinAndMapMany(
				"e.invited_users",
				EventInvitationEntity,
				"invitation",
				"invitation.event_id = e.id",
			)
			.leftJoinAndMapOne(
				"invitation.user",
				UserEntity,
				"user",
				"user.id = invitation.user_id",
			)
			.leftJoinAndMapOne(
				"user.agency",
				AgencyEntity,
				"agency",
				"agency.id = user.agency_id",
			)
			.leftJoinAndMapOne(
				"e.city",
				CitiesEntity,
				"city",
				"city.id = e.city_id",
			)
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
			.select([
				"e.id",
				"e.is_liked",
				"e.is_joined",
				"e.title",
				"e.description",
				"e.photo",
				"e.location",
				"e.date",
				"e.start_time",
				"e.end_time",
				"e.leader",
				"e.max_visitors",
				"e.phone",
				"e.format",
				"e.type",
				"e.is_banner",
				"e.is_draft",
				"e.tags",
				"city.id",
				"city.name",
				"contacts.id",
				"contacts.fullname",
				"contacts.phone",
				"invitation.id",
				"invitation.is_accepted",
				"user.id",
				"user.avatar",
				"user.fullName",
				"agency.id",
				"agency.title",
			])
			.addSelect("to_char(e.start_time, 'HH24:MI') AS e_start_time")
			.addSelect("to_char(e.end_time, 'HH24:MI') AS e_end_time")
			.setParameter("user_id", user.user_id);
		if (dto.query_type !== QueryType.ALL) {
			const today_date = new Date();
			eventsQuery = eventsQuery.andWhere("e.date >= :today_date", {
				today_date: today_date,
			});
		}
		if (!dto.is_draft || user.role !== RoleType.ADMIN) {
			eventsQuery = eventsQuery
				.andWhere("e.is_draft IS FALSE")
				.orWhere("e.create_by_id = :create_by_id", {
					create_by_id: user.user_id,
				});
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
		const eventCount = await eventsQuery.getCount();

		eventsQuery = eventsQuery.limit(dto.limit).offset(pageSize);

		const eventsResponse = new ServiceResponse<EventsEntity[]>();
		eventsResponse.links = calcPagination(eventCount, dto.page, dto.limit);
		eventsResponse.data = await eventsQuery.getMany();
		return eventsResponse;
	}

	async userEvents(user: ICurrentUser) {
		const foundInvitations = await this.eventInvitationRepository.find({
			select: { id: true, event_id: true },
			where: { user_id: user.user_id },
		});
		let eventQuery = this.eventRepository
			.createQueryBuilder("e")
			.leftJoinAndMapMany(
				"e.contacts",
				ContactEntity,
				"contacts",
				"contacts.event_id = e.id",
			)
			.leftJoinAndMapMany(
				"e.invited_users",
				EventInvitationEntity,
				"invitation",
				"invitation.event_id = e.id",
			)
			.leftJoinAndMapOne(
				"invitation.user",
				UserEntity,
				"user",
				"user.id = invitation.user_id",
			)
			.leftJoinAndMapOne(
				"user.agency",
				AgencyEntity,
				"agency",
				"agency.id = user.agency_id",
			)
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
			.select([
				"e.id",
				"e.is_liked",
				"e.is_joined",
				"e.title",
				"e.description",
				"e.photo",
				"e.location",
				"e.date",
				"e.start_time",
				"e.end_time",
				"e.leader",
				"e.max_visitors",
				"e.phone",
				"e.format",
				"e.type",
				"e.is_banner",
				"e.is_draft",
				"e.tags",
				"contacts.id",
				"contacts.fullname",
				"contacts.phone",
				"invitation.id",
				"invitation.is_accepted",
				"user.id",
				"user.avatar",
				"user.fullName",
				"agency.id",
				"agency.title",
			])
			.addSelect("to_char(e.start_time, 'HH24:MI') AS e_start_time")
			.addSelect("to_char(e.end_time, 'HH24:MI') AS e_end_time")
			.setParameter("user_id", user.user_id)
			.where("e.create_by_id = :create_by_id", {
				create_by_id: user.user_id,
			});
		if (foundInvitations.length) {
			eventQuery = eventQuery.orWhere("e.id in (:...id)", {
				id: foundInvitations.map((e) => e.event_id),
			});
		}
		const foundEvent = await eventQuery.getMany();
		if (!foundEvent.length) {
			throw new EventsNotFoundError(`id: ${user.user_id}`);
		}
		return foundEvent;
	}

	async create(dto: CreateEventsDto, user: ICurrentUser) {
		const event = this.eventRepository.create(dto);
		event.create_by_id = user.user_id;
		await this.citiesService.readOne(dto.city_id);
		const newEvent = await this.eventRepository.save(event);
		let contacts = this.contactsRepository.create(dto.contacts);
		contacts = contacts.map((e) => {
			e.event_id = event.id;
			return e;
		});
		newEvent.contacts = await this.contactsRepository.save(contacts);
		return newEvent;
	}

	async update(id: number, dto: UpdateEventsDto) {
		const foundEvent = await this.eventRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${id}`);
		}
		await this.citiesService.readOne(dto.city_id);
		await this.eventRepository.update(foundEvent.id, {
			...dto,
			contacts: undefined,
		});
		const updatedEvent = await this.eventRepository.findOne({
			where: {
				id: foundEvent.id,
			},
		});
		if (dto.contacts.length && updatedEvent) {
			await this.contactsRepository
				.createQueryBuilder()
				.delete()
				.where("event_id = :event_id", { event_id: foundEvent.id })
				.execute();
			let contacts = this.contactsRepository.create(dto.contacts);
			contacts = contacts.map((c) => {
				c.event_id = foundEvent.id;
				return c;
			});
			updatedEvent.contacts =
				await this.contactsRepository.save(contacts);
		}
		return updatedEvent as EventsEntity;
	}

	async toggleLike(
		body: LikeEventDto,
		user: ICurrentUser,
	): Promise<LikedResponse> {
		const event = await this.eventRepository.findOne({
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

	async inviteUsers(dto: InviteUsersDto) {
		const foundEvent = await this.eventRepository.findOne({
			select: { id: true, max_visitors: true },
			where: {
				id: dto.id,
			},
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${dto.id}`);
		}
		if (dto.agency_id) {
			const foundAgency = await this.agenciesService.repository.findOne({
				select: { id: true, user: { id: true } },
				relations: { user: true },
				where: { id: dto.agency_id },
			});
			if (!foundAgency) {
				throw new AgencyNotFoundError(`agent_id: ${dto.agency_id}`);
			}
			foundAgency.user.forEach((e) => {
				dto.user_ids.push(e.id);
			});
		}
		const currentVisitors = await this.eventInvitationRepository.count({
			where: { event_id: dto.id, user_id: In(dto.user_ids) },
		});
		if (foundEvent.max_visitors < currentVisitors + dto.user_ids.length) {
			throw new EventReachedMaximumVisitorsError(
				`max visitors: ${foundEvent.max_visitors} < current visitors: ${currentVisitors + dto.user_ids.length}`,
			);
		}
		const users = await this.userService.repository.find({
			select: { id: true },
			where: {
				id: In(dto.user_ids),
			},
		});
		if (!users.length) {
			throw new UserNotFoundError(`ids: ${dto.user_ids.join(", ")}`);
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
		const foundEvent = await this.eventRepository.findOne({
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
				`max visitors: ${foundEvent.max_visitors} < current visitors: ${currentVisitors + 1}`,
			);
		}
		const invitation = this.eventInvitationRepository.create({
			user_id: user.user_id,
			event_id: foundEvent.id,
		});
		return await this.eventInvitationRepository.save(invitation);
	}

	async acceptInvitation(dto: AcceptInvitationDto, user: ICurrentUser) {
		const foundEvent = await this.eventRepository.findOne({
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

	async remove(id: number) {
		const foundEvent = await this.eventRepository.findOne({
			select: { id: true },
			where: { id: id },
		});
		if (!foundEvent) {
			throw new EventsNotFoundError(`id: ${id}`);
		}
		await this.eventRepository.delete(id);
		return foundEvent;
	}
}
