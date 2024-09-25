import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ClientEntity } from "../client/client.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";
import { PremiseEntity } from "../premises/premises.entity";

@Entity({ name: "call_requests" })
export class CallRequestEntity extends BaseEntity {
	@ManyToOne(() => UserEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ type: "integer" })
	agent_id!: number;

	@ManyToOne(() => ClientEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	client!: ClientEntity;

	@Column({ type: "integer", nullable: true })
	client_id!: number;

	@ManyToOne(() => ClientEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	premise!: PremiseEntity;

	@Column({ type: "integer", nullable: true })
	premise_id!: number;

	@Column({ type: "varchar", length: 32 })
	phone!: string;
}
