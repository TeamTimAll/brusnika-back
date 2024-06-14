import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
} from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { AgenciesEntity } from "../agencies/agencies.entity";
import { ClientEntity } from "../client/client.entity";
import { PremisesEntity } from "../premises/premises.entity";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../user/user.entity";

import { LeadsDto } from "./dtos/leads.dto";

@Entity({ name: "leads" })
@UseDto(LeadsDto)
export class LeadsEntity extends AbstractEntity<LeadsDto> {
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
	manager?: UserEntity;

	@Column({ nullable: true })
	manager_id?: string;

	@ManyToOne(() => ProjectEntity)
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({ nullable: true })
	project_id?: string;

	@ManyToOne(() => PremisesEntity)
	@JoinColumn({ name: "premise_id" })
	premise!: PremisesEntity;

	@Column({ nullable: true })
	premise_id?: string;

	@Column({ nullable: true })
	fee?: number;

	@Column({ default: true })
	status!: string;

	// Status dan status'ga o'tgan vaqti
	// client_op;

	@Column({ type: "integer" })
	premise_price!: number;

	@Column({ type: "integer" })
	initial_payment_amount!: number;

	@Column({ type: "varchar", length: 255 })
	comment!: string;

	@CreateDateColumn()
	sending_date!: Date;

	@Column({ type: "timestamp" })
	received_request_date?: Date;
}
