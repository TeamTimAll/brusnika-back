import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { Brackets, In, Not, Repository } from "typeorm";

import { DraftResponseDto } from "common/dtos/draftResponse.dto";
import { LikedResponseDto } from "common/dtos/likeResponse.dto";
import { ICurrentUser } from "interfaces/current-user.interface";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { AgencyService } from "../../modules/agencies/agencies.service";
import { AgencyNotFoundError } from "../../modules/agencies/errors/AgencyNotFound.error";
import { CityService } from "../../modules/cities/cities.service";
import { UserNotFoundError } from "../../modules/user/errors/UserNotFound.error";
import { UserService } from "../../modules/user/user.service";
import { AgencyEntity } from "../agencies/agencies.entity";
import { CityEntity } from "../cities/cities.entity";
import { NotificationNotFoundError } from "../notification/errors/NotificationNotFound.error";
import { NotificationType } from "../notification/notification.entity";
import { NotificationService } from "../notification/notification.service";
import { UserEntity } from "../user/user.entity";
import { NotificationUserEntity } from "../notification/notification_user.entity";

import { AcceptInvitionDto } from "./dtos/AcceptInvition.dto";
import { BannerFilterDto } from "./dtos/BannerFilter.dto";
import { CreateEventsDto } from "./dtos/CreateEvents.dto";
import { EventSearchDto } from "./dtos/EventSearch.dto";
import { FilterEventsDto, QueryType } from "./dtos/FilterEvents.dto";
import { InviteUsersDto } from "./dtos/InviteUsers.dto";
import { LeaveInvitionDto } from "./dtos/LeaveInvition.dto";
import { RecommendedEventDto } from "./dtos/RecommendedEvent.dto";
import { ToggleEventDto } from "./dtos/ToggleEvent.dto";
import { type UpdateEventsDto } from "./dtos/UpdateEvents.dto";
import { EventContactEntity } from "./entities/event-contact.entity";
import { EventInvitationEntity } from "./entities/event-invition.entity";
import { EventLikesEntity } from "./entities/event-likes.entity";
import { EventViewsEntity } from "./entities/event-views.entity";
import { EventInvitationNotFoundError } from "./errors/EventInvitionNotFound.error";
import { EventReachedMaximumVisitorsError } from "./errors/EventReachedMaximumVisitors.error";
import { UserAlreadyRegisteredToEventError } from "./errors/UserAlreadyRegisteredToEvent.error";
import { EventsNotFoundError } from "./errors/events-not-found.error";
import { EventsEntity } from "./events.entity";

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EventsEntity)
		private eventRepository: Repository<EventsEntity>,
		@InjectRepository(EventContactEntity)
		private contactsRepository: Repository<EventContactEntity>,
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
		@Inject()
		private notificationService: NotificationService,
		private logger: Logger,
	) {
		void (async () => {
			const events = await eventRepository
				.createQueryBuilder("e")
				.select([
					"e.id",
					"e.date",
					"e.start_time",
					"e.title",
					"e.city_id",
				] as Array<`e.${keyof EventsEntity}`>)
				.where("e.date >= CURRENT_DATE")
				.getMany();
			events.forEach((e) => {
				try {
					const eventDate = new Date(
						`${e.date}T${e.start_time}.000Z`,
					);
					if (eventDate.getTime() > Date.now()) {
						new CronJob(
							eventDate,
							() => this.sendWarning(e.id, e.title),
							null,
							true,
						);
						this.logger.log(
							`Event id: ${e.id}, Event datetime: ${e.date}T${e.start_time}.000Z; Success`,
							"CronJob",
						);
					}
				} catch (error) {
					if (error instanceof Error) {
						this.logger.log(
							`Event id: ${e.id}, Event datetime: ${e.date}T${e.start_time}.000Z; Error: ${error.message}`,
							"CronJob",
						);
					}
				}
			});
		})();
	}

	get repository() {
		return this.eventRepository;
	}

	async search(dto: EventSearchDto): Promise<BaseDto<EventsEntity[]>> {
		const pageSize = (dto.page - 1) * dto.limit;
		const [events, eventCount] = await this.eventRepository
			.createQueryBuilder("e")
			.select(["e.id", "e.title"] as Array<`e.${keyof EventsEntity}`>)
			.where("e.is_active IS TRUE")
			.andWhere(
				new Brackets((qb) =>
					qb
						.where("e.title ILIKE :text", {
							text: `${dto.text}%`,
						})
						.orWhere("e.description ILIKE :text", {
							text: `${dto.text}%`,
						}),
				),
			)
			.limit(dto.limit)
			.offset(pageSize)
			.getManyAndCount();

		const metaData = BaseDto.create<EventsEntity[]>();
		metaData.setPagination(eventCount, dto.page, dto.limit);
		metaData.data = events;
		return metaData;
	}

	async readOne(id: number, user: ICurrentUser) {
		const foundEvent = await this.selectEventQuery(user)
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
		let eventsQuery = this.selectEventQuery(user);
		if (!(user.role === RoleType.ADMIN && dto.include_non_actives)) {
			eventsQuery = eventsQuery.andWhere("e.is_active IS TRUE");
		}
		if (dto.query_type !== QueryType.ALL) {
			const today_date = new Date();
			eventsQuery = eventsQuery.andWhere("e.date >= :today_date", {
				today_date: today_date,
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
		if (!dto.is_draft || user.role !== RoleType.ADMIN) {
			eventsQuery = eventsQuery.andWhere("e.is_draft IS FALSE");
			// .orWhere("e.create_by_id = :create_by_id", {
			// 	create_by_id: user.user_id,
			// });
		}
		const eventCount = await eventsQuery.getCount();

		eventsQuery = eventsQuery.limit(dto.limit).offset(pageSize);

		const metaData = BaseDto.create<EventsEntity[]>();
		metaData.setPagination(eventCount, dto.page, dto.limit);
		metaData.data = await eventsQuery.getMany();
		return metaData;
	}

	async userEvents(user: ICurrentUser) {
		const foundInvitations = await this.eventInvitationRepository.find({
			select: { id: true, event_id: true },
			where: { user_id: user.user_id },
		});
		let eventQuery = this.selectEventQuery(user).where(
			"e.create_by_id = :create_by_id",
			{
				create_by_id: user.user_id,
			},
		);
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

	async banner(
		dto: BannerFilterDto,
		user: ICurrentUser,
	): Promise<EventsEntity[]> {
		let eventsQuery = this.selectEventQuery(user)
			.andWhere("e.is_banner IS TRUE")
			.andWhere("e.is_draft IS FALSE");

		const today_date = new Date();
		eventsQuery = eventsQuery.andWhere("e.date >= :today_date", {
			today_date: today_date,
		});
		if (dto.city_id) {
			eventsQuery = eventsQuery.andWhere("e.city_id = :city_id", {
				city_id: dto.city_id,
			});
		}
		return eventsQuery.getMany();
	}

	async recommend(
		dto: RecommendedEventDto,
		user: ICurrentUser,
	): Promise<EventsEntity[]> {
		let eventsQuery = this.selectEventQuery(user)
			.where("e.id != :id", { id: dto.event_id })
			.andWhere(
				new Brackets((qb) => {
					qb.where("e.is_banner IS FALSE")
						.andWhere("e.is_draft IS FALSE")
						.orWhere("e.create_by_id = :create_by_id", {
							create_by_id: user.user_id,
						});
				}),
			)
			.orderBy("e.date", "ASC");
		const today_date = new Date();
		eventsQuery = eventsQuery.andWhere("e.date >= :today_date", {
			today_date: today_date,
		});
		if (dto.city_id) {
			eventsQuery = eventsQuery.andWhere("e.city_id = :city_id", {
				city_id: dto.city_id,
			});
		}
		return eventsQuery.getMany();
	}

	selectEventQuery(user: ICurrentUser) {
		return this.eventRepository
			.createQueryBuilder("e")
			.leftJoinAndMapMany(
				"e.contacts",
				EventContactEntity,
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
				CityEntity,
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
				"e.city_id",
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
	}

	async create(dto: CreateEventsDto, user: ICurrentUser) {
		const event = this.eventRepository.create(dto);
		event.create_by_id = user.user_id;
		await this.citiesService.checkExsits(dto.city_id);
		const newEvent = await this.eventRepository.save(event);
		const contacts: EventContactEntity[] = [];
		dto.contacts.forEach((c) => {
			const contact = this.contactsRepository.create(c);
			contact.event_id = newEvent.id;
			contacts.push(contact);
		});
		newEvent.contacts = await this.contactsRepository.save(contacts);

		if (!dto.is_draft && dto.push_notification) {
			const userTokens = (await this.userService.repository.find({
				select: { id: true, firebase_token: true },
				where: {
					role: In([RoleType.HEAD_OF_AGENCY, RoleType.AGENT]),
					city_id: newEvent.city_id,
					id: Not(user.user_id),
				},
			})) as Array<Pick<UserEntity, "id" | "firebase_token">>;

			await this.notificationService.sendToUsers(userTokens, {
				title: "Мероприятие",
				description: `Новое мероприятие создано ${newEvent.title}`,
				type: NotificationType.CREATED_EVENT,
				object_id: newEvent.id,
			});
		}
		const eventDate = new Date(
			`${newEvent.date}T${newEvent.start_time}:00.000Z`,
		);
		if (eventDate.getTime() > Date.now()) {
			new CronJob(
				new Date(`${newEvent.date}T${newEvent.start_time}:00.000Z`), // Added :00 because time does not included
				() => this.sendWarning(newEvent.id, newEvent.title),
				null,
				true,
			);
			this.logger.log(
				`Event id: ${newEvent.id}, Event datetime: ${newEvent.date}T${newEvent.start_time}.000Z; Success`,
				"CronJob",
			);
		}

		return newEvent;
	}

	private async sendWarning(event_id: number, event_title: string) {
		const eventInvitations = (await this.eventInvitationRepository.find({
			select: { user: { id: true, firebase_token: true } },
			relations: { user: true },
			where: {
				event_id: event_id,
			},
		})) as {
			["user"]: Pick<
				Pick<EventInvitationEntity, "user">["user"],
				"id" | "firebase_token"
			>;
		}[];

		await this.notificationService.sendToUsers(
			eventInvitations.map((e) => e.user),
			{
				title: "Мероприятие",
				description: `Незадолго до начала мероприятия ${event_title}`,
				type: NotificationType.WARNING_EVENT,
				object_id: event_id,
			},
		);
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
		dto: ToggleEventDto,
		user: ICurrentUser,
	): Promise<LikedResponseDto> {
		const event = await this.eventRepository.findOne({
			where: {
				id: dto.event_id,
			},
		});
		if (!event) {
			throw new EventsNotFoundError(`id: ${dto.event_id}`);
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

	async toggleDraft(dto: ToggleEventDto): Promise<DraftResponseDto> {
		const event = await this.eventRepository.findOne({
			select: { id: true, is_draft: true, title: true },
			where: {
				id: dto.event_id,
			},
		});
		if (!event) {
			throw new EventsNotFoundError(`id: ${dto.event_id}`);
		}
		await this.eventRepository.update(event.id, {
			is_draft: !event.is_draft,
		});
		return {
			is_draft: !event.is_draft,
		};
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
			select: { id: true, firebase_token: true },
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

		await this.notificationService.sendToUsers(users, {
			title: "Мероприятие",
			description: `Вас пригласили на мероприятие ${foundEvent.title}`,
			type: NotificationType.EVENT,
			object_id: foundEvent.id,
		});

		const createdInvitations =
			await this.eventInvitationRepository.save(invitations);

		return createdInvitations;
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

	async acceptInvitation(dto: AcceptInvitionDto, user: ICurrentUser) {
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
		const foundNotification = await this.notificationService.repository
			.createQueryBuilder("n")
			.select("n.id")
			.leftJoin(NotificationUserEntity, "nu", "nu.notification_id = n.id")
			.limit(1)
			.orderBy("n.id", "DESC")
			.where("nu.user_id = :user_id", {
				user_id: user.user_id,
			})
			.andWhere("n.object_id = :object_id", {
				object_id: foundEvent.id,
			})
			.getOne();
		if (!foundNotification) {
			throw new NotificationNotFoundError(
				`event_id: ${foundEvent.id}, user_id: ${user.user_id}`,
			);
		}
		if (dto.is_accepted) {
			await this.notificationService.readNotification(
				foundNotification.id,
				user,
			);
		} else {
			await this.notificationService.repository.delete(
				foundNotification.id,
			);
		}
		await this.eventInvitationRepository.update(foundInvitation.id, {
			is_accepted: dto.is_accepted,
		});
		foundInvitation.is_accepted = dto.is_accepted;
		return foundInvitation;
	}

	async leaveFromEvent(dto: LeaveInvitionDto, user: ICurrentUser) {
		const foundEventInvitation =
			await this.eventInvitationRepository.findOne({
				select: { id: true, event_id: true },
				where: { event_id: dto.event_id, user_id: user.user_id },
			});
		if (!foundEventInvitation) {
			throw new EventInvitationNotFoundError(
				`event_id: ${dto.event_id}, user_id: ${user.user_id}`,
			);
		}
		await this.eventInvitationRepository.delete(foundEventInvitation.id);
		return await this.eventRepository.findOne({
			where: { id: foundEventInvitation.event_id },
		});
	}

	async delete(id: number) {
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
