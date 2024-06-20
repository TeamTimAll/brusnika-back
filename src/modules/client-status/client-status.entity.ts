import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Uuid } from "boilerplate.polyfill";
import { IStatusType } from "types/client.types";

import { AbstractEntity } from "../../common/abstract.entity";
import { ClientEntity } from "../../modules/client/client.entity";

import { ClientStatusDto } from "./dto/client.status.dto";

@Entity({ name: "client_status" })
export class ClientStatusEntity extends AbstractEntity<ClientStatusDto> {
	@Column({ type: "varchar" })
	type!: IStatusType;

	@Column({ type: "uuid" })
	client_id!: Uuid;

	@OneToOne(() => ClientEntity, (client) => client.status)
	@JoinColumn({ name: "client_id" })
	client!: ClientEntity;
}
