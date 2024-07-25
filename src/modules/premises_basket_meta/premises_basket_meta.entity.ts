import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { AgenciesEntity } from "../agencies/agencies.entity";
import { ClientEntity } from "../client/client.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: "premises_basket_meta" })
export class PremisesBasketMetaEntity extends BaseEntity {
	@ManyToOne(() => ClientEntity)
	@JoinColumn({ name: "clinet_id" })
	client!: ClientEntity;

	@Column({ type: "integer", nullable: true })
	clinet_id?: number;

	@ManyToOne(() => AgenciesEntity)
	@JoinColumn({ name: "agent_id" })
	agent!: AgenciesEntity;

	@Column({ type: "integer", nullable: true })
	agent_id?: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "manager_id" })
	manager!: UserEntity;

	@Column({ type: "integer", nullable: true })
	manager_id?: number;
}
