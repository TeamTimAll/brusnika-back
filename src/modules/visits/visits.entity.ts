import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { ClientEntity } from "../client/client.entity";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../user/user.entity";

export enum VisitStatus {
	OPEN = "открыто",
	SUCCESS = "успешно",
	FAIL = "неуспешно",
}

export enum PuchaseOptions {
	MORTAGE = "mortage",
	INSTALLMENT = "installment",
	BILL = "bill",
	FULL_PAYMENT = "full_payment",
}

@Entity({ name: "visits" })
export class VisitsEntity extends AbstractEntity {
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

	@Column({ nullable: true, type: "uuid" })
	project_id?: string;

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

	@Column({ nullable: true, type: "uuid" })
	client_id?: string;

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

	@Column({ nullable: true, type: "uuid" })
	agent_id?: string;

	@Column({ type: "date" })
	date!: Date;

	@Column({ type: "time" })
	time!: Date;

	// @Column({ type: "enum", enum: PuchaseOptions })
	// purchase_option!: PuchaseOptions;

	@Column({ default: VisitStatus.OPEN, enum: VisitStatus })
	status!: VisitStatus;

	static toDto(
		entity: Partial<WithOutToDto<VisitsEntity>>,
	): WithOutToDto<VisitsEntity> {
		const dto: WithOutToDto<VisitsEntity> = {
			id: entity.id ?? "",
			project: entity.project ?? new ProjectEntity(),
			project_id: entity.project_id ?? "",
			client: entity.client ?? new ClientEntity(),
			client_id: entity.client_id ?? "",
			agent: entity.agent ?? new UserEntity(),
			agent_id: entity.agent_id ?? "",
			date: entity.date ?? new Date(),
			time: entity.time ?? new Date(),
			// purchase_option: entity.purchase_option ?? PuchaseOptions.BILL,
			status: entity.status ?? VisitStatus.OPEN,
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
		};
		return dto;
	}
}
