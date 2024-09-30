import { Column, Entity, VirtualColumn } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

export enum NotificationType {
	EVENT = "event",
	CREATED_EVENT = "created_event",
	WARNING_EVENT = "warning_event",
	CREATED_NEWS = "created_news",
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

	@VirtualColumn({ query: () => "" })
	is_read!: boolean;
}
