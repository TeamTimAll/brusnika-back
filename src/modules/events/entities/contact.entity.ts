import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../../common/abstract.entity";
import { EventsEntity } from "../events.entity";

@Entity({ name: "contacts" })
export class ContactEntity extends AbstractEntity {
	@Column({ type: "varchar" })
	fullname!: string;

	@Column({ type: "varchar" })
	phone!: string;

	@ManyToOne(() => EventsEntity, (e) => e.contacts)
	@JoinColumn({ name: "event_id" })
	event?: EventsEntity;

	@Column({ nullable: true, type: "integer" })
	event_id?: number;
}
