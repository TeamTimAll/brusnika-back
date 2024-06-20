import { Column, Entity } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";

import { ClientDto } from "./dto/client.dto";

export enum ClientStatus {
	lead_verification = "проверка лида",
	cencel_fixing = "отказ в закреплении",
	weak_fixing = "слабое закрепление",
	strong_fixing = "сильное закрепление",
}

@Entity({ name: "clients" })
@UseDto(ClientDto)
export class ClientEntity extends AbstractEntity<ClientDto> {
	@Column({ type: "varchar", length: 255 })
	fullname!: string;

	@Column({ type: "varchar", length: 15 })
	phone_number!: string;

	@Column({ type: "timestamp" })
	actived_from_date!: Date;

	@Column({ type: "timestamp" })
	actived_to_date!: Date;

	@Column({ type: "text", nullable: true })
	comment?: string;

	@Column({ type: "enum", enum: ClientStatus })
	status!: ClientStatus;

	@Column({ type: "int" })
	expiration_date!: number;

	@Column({ type: "text", nullable: true })
	node?: string;
}
