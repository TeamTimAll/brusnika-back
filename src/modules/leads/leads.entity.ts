import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ClientEntity } from "../client/client.entity";
import { PremisesEntity } from "../premises/premises.entity";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../user/user.entity";

import { LeadOpStatus, LeadOpsEntity } from "./lead_ops.entity";

export enum LeadState {
	ACTIVE = "Активные",
	IN_PROGRESS = "На паузе",
	FAILED = "Проиграна",
	COMPLETE = "Выиграна",
}

@Entity({ name: "leads" })
export class LeadsEntity extends BaseEntity {
	@ManyToOne(() => ClientEntity)
	@JoinColumn({ name: "client_id" })
	client!: ClientEntity;

	@Column({ type: "integer", nullable: true })
	client_id?: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ type: "integer", nullable: true })
	agent_id?: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "manager_id" })
	manager?: UserEntity;

	@Column({ type: "integer", nullable: true })
	manager_id?: number;

	@ManyToOne(() => ProjectEntity)
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({ type: "integer", nullable: true })
	project_id?: number;

	@ManyToOne(() => PremisesEntity)
	@JoinColumn({ name: "premise_id" })
	premise!: PremisesEntity;

	@Column({ type: "integer", nullable: true })
	premise_id?: number;

	@Column({ nullable: true, type: "integer" })
	fee?: number;

	@Column({ enum: LeadOpStatus, default: LeadOpStatus.OPEN })
	current_status!: LeadOpStatus;

	@Column({ default: 0, type: "integer" })
	lead_number!: number;

	@Column({ default: LeadState.ACTIVE, enum: LeadState })
	state!: LeadState;

	@OneToMany(() => LeadOpsEntity, (type) => type.lead)
	lead_ops?: LeadOpsEntity[];
}
