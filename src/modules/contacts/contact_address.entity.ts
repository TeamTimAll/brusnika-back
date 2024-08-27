import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

import { ContactEntity } from "./contact.entity";

@Entity("contact_addresses")
export class ContactAddressEntity extends BaseEntity {
	@Column({ type: "varchar" })
	title!: string;

	@Column({ type: "varchar", nullable: true })
	lat?: string;

	@Column({ type: "varchar", nullable: true })
	long?: string;

	@OneToOne(() => ContactEntity, (c) => c.address, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "contact_id" })
	contact!: ContactEntity;

	@Column({ type: "integer" })
	contact_id!: number;
}
