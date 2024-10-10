import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";

import { NotificationEntity } from "./notification.entity";

@Entity("notification_user")
export class NotificationUserEntity extends BaseEntity {
	@ManyToOne(() => NotificationEntity, {
		onUpdate: "SET NULL",
		onDelete: "SET NULL",
	})
	@JoinColumn({ name: "notification_id" })
	notification!: NotificationEntity;

	@Column({ type: "integer", nullable: true })
	notification_id?: number;

	@ManyToOne(() => UserEntity, {
		onUpdate: "SET NULL",
		onDelete: "SET NULL",
	})
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer", nullable: true })
	user_id?: number;

	@Column({ type: "boolean", default: false })
	is_read!: boolean;
}
