import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { UserEntity } from "../../user/user.entity";
import { EventsEntity } from "../events.entity";

@Entity("event_likes")
@Unique(["user_id", "event_id"])
export class EventLikesEntity extends BaseEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	event_id!: number;

	@ManyToOne(() => EventsEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "event_id" })
	events!: EventsEntity;
}
