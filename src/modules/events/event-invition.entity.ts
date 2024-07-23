import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UserEntity } from "../user/user.entity";

import { EventsEntity } from "./events.entity";

@Entity("event_invition")
export class EventInvitionEntity extends AbstractEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@Column({ type: "integer" })
	event_id!: number;

	@Column({ type: "boolean", nullable: true })
	is_accepted?: boolean;

	@ManyToOne(() => EventsEntity)
	@JoinColumn({ name: "event_id" })
	event!: EventsEntity;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;
}
