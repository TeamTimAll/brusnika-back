import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { ClientEntity } from "../client/client.entity";
import { PremisesEntity } from "../premises/premises.entity";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../user/user.entity";

import { LeadsDto } from "./dtos/leads.dto";
import { LeadOpsEntity } from "./lead_ops.entity";

@Entity({ name: "leads" })
@UseDto(LeadsDto)
export class LeadsEntity extends AbstractEntity<LeadsDto> {
	@ManyToOne(() => ClientEntity)
	@JoinColumn({ name: "clinet_id" })
	client!: ClientEntity;

	@Column({ nullable: true })
	clinet_id?: string;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

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

	@Column({ nullable: true, type: "integer" })
	fee?: number;

	@OneToMany(() => LeadOpsEntity, (type) => type.lead)
	lead_ops?: LeadOpsEntity[];
}
