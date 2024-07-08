import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { CitiesEntity } from "../cities/cities.entity";
import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";

import { EventsDto } from "./dtos/events.dto";

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
@UseDto(EventsDto)
export class EventsEntity extends AbstractEntity<EventsDto> {
	@Column({ nullable: true, type: "varchar" })
	title!: string;

	@Column({ nullable: true, type: "varchar" })
	description!: string;

	@Column({ nullable: true, type: "varchar" })
	photo!: string;

	@Column({ type: "varchar", nullable: true })
	location?: string;

	@Column({ type: "date", nullable: true })
	date?: Date;

	@Column({ type: "time without time zone", nullable: true })
	start_time?: Date;

	@Column({ type: "time without time zone", nullable: true })
	end_time?: Date;

	@Column({ type: "varchar", nullable: true })
	leader?: string;

	@Column({ type: "int", nullable: true })
	max_visitors?: number;

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

	@ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CitiesEntity;

	@Column({ type: "integer", nullable: true })
	city_id?: number;

	// @Column({ default: 0 })
	// likeCount!: number;

	// @Column({ default: 0 })
	// views!: number;

	// @OneToMany(() => CommentEntity, (comment) => comment.event)
	// comments?: CommentEntity[];
}
