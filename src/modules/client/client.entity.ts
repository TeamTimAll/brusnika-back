import { Column, Entity } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";

export enum ClientTag {
	LEAD_VERIFICATION = "проверка лида",
	CENCEL_FIXING = "отказ в закреплении",
	WEAK_FIXING = "слабое закрепление",
	STRONG_FIXING = "сильное закрепление",
}

@Entity({ name: "clients" })
export class ClientEntity extends AbstractEntity {
	@Column({ type: "varchar", length: 255 })
	fullname!: string;

	@Column({ type: "varchar", length: 15 })
	phone_number!: string;

	@Column({ type: "timestamp" })
	actived_date!: Date;

	@Column({ type: "text", nullable: true })
	comment?: string;

	@Column({ type: "enum", enum: ClientTag, nullable: true })
	status?: ClientTag;

	@Column({ type: "timestamp" })
	expiration_date!: Date;

	@Column({ type: "text", nullable: true })
	node?: string;
}
