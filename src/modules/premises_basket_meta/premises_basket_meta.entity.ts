import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { AgenciesEntity } from "../agencies/agencies.entity";
import { ClientEntity } from "../client/client.entity";
import { UserEntity } from "../user/user.entity";

import { PremisesBasketMetaDto } from "./dtos/premises_basket_meta.dto";

@Entity({ name: "premises_basket_meta" })
@UseDto(PremisesBasketMetaDto)
export class PremisesBasketMetaEntity extends AbstractEntity<PremisesBasketMetaDto> {
	@ManyToOne(() => ClientEntity)
	@JoinColumn({ name: "clinet_id" })
	client!: ClientEntity;

	@Column({ nullable: true })
	clinet_id?: string;

	@ManyToOne(() => AgenciesEntity)
	@JoinColumn({ name: "agent_id" })
	agent!: AgenciesEntity;

	@Column({ nullable: true })
	agent_id?: string;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "manager_id" })
	manager!: UserEntity;

	@Column({ nullable: true })
	manager_id?: string;
}
