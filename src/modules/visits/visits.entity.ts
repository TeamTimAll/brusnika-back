import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ClientEntity } from "../client/client.entity";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../user/user.entity";

export enum VisitStatus {
	OPEN = "open",
	ASSIGNED = "assigned",
	SUCCESS = "success",
	FAIL = "fail",
}

export enum PuchaseOptions {
	MORTAGE = "mortage",
	INSTALLMENT = "installment",
	BILL = "bill",
	FULL_PAYMENT = "full_payment",
}

@Entity({ name: "visits" })
export class VisitsEntity extends BaseEntity {
	@ManyToOne(
		() => ProjectEntity,
		(ProjectEntity: ProjectEntity) => ProjectEntity.visits,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({ nullable: true, type: "integer" })
	project_id?: number;

	@ManyToOne(
		() => ClientEntity,
		(ClientEntity: ClientEntity) => ClientEntity.visits,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "client_id" })
	client!: ClientEntity;

	@Column({ nullable: true, type: "integer" })
	client_id?: number;

	@ManyToOne(
		() => UserEntity,
		(UserEntity: UserEntity) => UserEntity.visits,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	agent_id?: number;

	@Column({ type: "date" })
	date!: Date;

	@Column({ type: "time" })
	time!: string;

	@Column({ type: "date", nullable: true })
	request_date!: Date | null;

	@Column({ type: "time", nullable: true })
	request_time!: Date | null;

	@Column({ nullable: true, type: "text" })
	note?: string;

	// @Column({ type: "enum", enum: PuchaseOptions })
	// purchase_option!: PuchaseOptions;

	@Column({ default: VisitStatus.OPEN, enum: VisitStatus })
	status!: VisitStatus;
}
