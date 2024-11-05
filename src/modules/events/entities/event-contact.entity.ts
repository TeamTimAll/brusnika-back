import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { EventsEntity } from "../events.entity";

@Entity({ name: "event_contacts" })
export class EventContactEntity extends BaseEntity {
	@Column({ type: "varchar" })
	fullname!: string;

	@Column({ type: "varchar" })
	phone!: string;

	@ManyToOne(() => EventsEntity, (e) => e.contacts, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "event_id" })
	event?: EventsEntity;

	@Column({ nullable: true, type: "integer" })
	event_id?: number;
}
