import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { UserEntity } from "../../user/user.entity";
import { EventsEntity } from "../events.entity";

@Entity("event_invitation")
export class EventInvitationEntity extends BaseEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@Column({ type: "integer" })
	event_id!: number;

	@Column({ type: "boolean", nullable: true })
	is_accepted?: boolean;

	@Column({ type: "boolean", nullable: true })
	is_invited?: boolean;

	@ManyToOne(() => EventsEntity, (e) => e.invited_users, {
		onDelete: "CASCADE",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "event_id" })
	event!: EventsEntity;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;
}
