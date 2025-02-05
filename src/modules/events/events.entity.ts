import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	VirtualColumn,
} from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../../modules/user/user.entity";
import { CityEntity } from "../cities/cities.entity";

import { EventContactEntity } from "./entities/event-contact.entity";
import { EventInvitationEntity } from "./entities/event-invition.entity";
import { EventLikesEntity } from "./entities/event-likes.entity";
import { EventViewsEntity } from "./entities/event-views.entity";

export enum EVENT_TYPES {
	PRESENTATION = "presentation",
	EXCURSION = "excursion",
	TRAINING = "training",
	TESTING = "testing",
}

// type online or offline
export enum EVENT_FORMAT {
	ONLINE = "online",
	OFFLINE = "offline",
}

@Entity({ name: "events" })
export class EventsEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	title!: string;

	@Column({ nullable: true, type: "varchar" })
	description!: string;

	@Column({ nullable: true, type: "varchar" })
	photo!: string;

	@Column({ type: "varchar", nullable: true })
	location?: string;

	@Column({ type: "date" })
	date!: string;

	@Column({ type: "time without time zone" })
	start_time!: string;

	@Column({ type: "time without time zone" })
	end_time!: Date;

	@Column({ type: "varchar", nullable: true })
	leader?: string;

	@Column({ type: "int", default: 0, nullable: true })
	max_visitors!: number;

	//contacts
	@Column({ type: "varchar", nullable: true })
	phone?: string;

	//type offline or online
	@Column({
		type: "enum",
		enum: EVENT_FORMAT,
		nullable: false,
	})
	format!: EVENT_FORMAT;

	@Column({
		type: "enum",
		enum: EVENT_TYPES,
		nullable: false,
	})
	type!: EVENT_TYPES;

	@ManyToOne(() => UserEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "create_by_id" })
	create_by!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	create_by_id?: number;

	@ManyToOne(() => CityEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CityEntity;

	@Column({ type: "integer" })
	city_id!: number;

	@OneToMany(() => EventContactEntity, (c) => c.event, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	contacts?: EventContactEntity[];

	@Column({ type: "boolean", default: false })
	is_banner!: boolean;

	@Column({ type: "boolean", default: false })
	is_draft!: boolean;

	@Column({ type: "boolean", default: false })
	push_notification!: boolean;

	@Column({ type: "text", array: true, nullable: true })
	tags?: string[];

	@OneToMany(() => EventViewsEntity, (EventViews) => EventViews.events, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	views?: EventViewsEntity[];

	@OneToMany(() => EventLikesEntity, (EventLikes) => EventLikes.events, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	likes?: EventLikesEntity[];

	@OneToMany(
		() => EventInvitationEntity,
		(EventInvitionEntity) => EventInvitionEntity.event,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	invited_users?: EventInvitationEntity[];

	@VirtualColumn({
		query: () =>
			"COALESCE((SELECT TRUE FROM event_likes el WHERE el.event_id = e.id AND el.user_id = :user_id LIMIT 1), FALSE)",
	})
	is_liked?: boolean;

	@VirtualColumn({
		query: () =>
			"COALESCE((SELECT TRUE FROM event_invitation ei WHERE ei.event_id = e.id AND ei.user_id = :user_id LIMIT 1), FALSE)",
	})
	is_joined?: boolean;
}
