import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { EventsEntity } from "../events.entity";

@Entity({ name: "contacts" })
export class ContactEntity extends BaseEntity {
	@Column({ type: "varchar" })
	fullname!: string;

	@Column({ type: "varchar" })
	phone!: string;

	@ManyToOne(() => EventsEntity, (e) => e.contacts, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "event_id" })
	event?: EventsEntity;

	@Column({ nullable: true, type: "integer" })
	event_id?: number;
}
