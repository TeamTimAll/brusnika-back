import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { CityEntity } from "../cities/cities.entity";

import { ContactAddressEntity } from "./contact_address.entity";
import { ContactWorkScheduleEntity } from "./contact_work_schedule.entity";

@Entity("contacts")
export class ContactEntity extends BaseEntity {
	@Column({ type: "varchar" })
	title!: string;

	@Column({ type: "varchar" })
	phone_number!: string;

	@OneToOne(() => ContactAddressEntity, (ca) => ca.contact, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	address!: ContactAddressEntity;

	@Column({ type: "varchar", nullable: true })
	address_link?: string;

	@Column({ type: "integer" })
	city_id!: number;

	@ManyToOne(() => CityEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "city_id" })
	city!: CityEntity;

	@OneToMany(() => ContactWorkScheduleEntity, (c) => c.contact, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	work_schedule!: ContactWorkScheduleEntity[];
}
