import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { Weekdays } from "../../common/enums/weekdays";

import { ContactEntity } from "./contact.entity";

@Entity("contact_work_schedules")
export class ContactWorkScheduleEntity extends BaseEntity {
	@Column({ type: "enum", enum: Weekdays })
	weekday!: Weekdays;

	@Column({ type: "time", nullable: true })
	start_time!: string;

	@Column({ type: "time", nullable: true })
	end_time!: string;

	@Column({ type: "integer" })
	contact_id!: number;

	@ManyToOne(() => ContactEntity, (c) => c.work_schedule, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "contact_id" })
	contact!: ContactEntity;
}
