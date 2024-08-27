import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { RussianWeekdaysString } from "../../common/enums/weekdays";

import { ContactEntity } from "./contact.entity";

@Entity("contact_work_schedules")
export class ContactWorkScheduleEntity extends BaseEntity {
	@Column({ type: "enum", enum: RussianWeekdaysString })
	weekday!: RussianWeekdaysString;

	@Column({ type: "time" })
	start_time!: string;

	@Column({ type: "time" })
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
