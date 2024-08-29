import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { Weekdays } from "../../common/enums/weekdays";
import { formatTime } from "../../lib/date";

import { ContactEntity } from "./contact.entity";

@Entity("contact_work_schedules")
export class ContactWorkScheduleEntity extends BaseEntity {
	@Column({ type: "enum", enum: Weekdays })
	weekday!: Weekdays;

	@Column({
		type: "time",
		nullable: true,
		transformer: {
			to: () => {},
			from: (value: string | null) =>
				value ? formatTime(value, "HH:MM") : value,
		},
	})
	start_time!: string;

	@Column({
		type: "time",
		nullable: true,
		transformer: {
			to: () => {},
			from: (value: string | null) =>
				value ? formatTime(value, "HH:MM") : value,
		},
	})
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
