import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";

export enum NotificationType {
	EVENT = "event",
	CREATED_EVENT = "created_event",
	WARNING_EVENT = "warning_event",
}

@Entity("notification")
export class NotificationEntity extends BaseEntity {
	@Column({ type: "varchar", length: 255 })
	title!: string;

	@Column({ type: "text", default: "" })
	description?: string;

	@Column({ enum: NotificationType })
	type!: NotificationType;

	@Column({ type: "integer" })
	object_id!: number;

	@Column({ type: "boolean", default: false })
	is_read!: boolean;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer", nullable: true })
	user_id?: number;
}
