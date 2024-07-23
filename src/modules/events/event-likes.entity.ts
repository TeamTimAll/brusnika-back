import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UserEntity } from "../../modules/user/user.entity";

import { EventsEntity } from "./events.entity";

@Entity("event_likes")
@Unique(["user_id", "event_id"])
export class EventLikesEntity extends AbstractEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	event_id!: number;

	@ManyToOne(() => EventsEntity)
	@JoinColumn({ name: "event_id" })
	events!: EventsEntity;
}
