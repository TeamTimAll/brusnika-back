import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ClientEntity } from "../client/client.entity";
import { LeadsEntity } from "../leads/leads.entity";
import { UserEntity } from "../user/user.entity";
import { ProjectEntity } from "../projects/project.entity";

export enum TaskType {
	FIRST_VIEW = "первичный показ",
	RE_VIEW = "повторный показ",
	CALL = "звонок клиенту",
	OTHER = "иное",
}

export enum TaskStatus {
	CREATED = "Создана",
	PENDING = "В работе",
	CLOSE = "Завершена",
	CANCEL = "Отменена",
}

@Entity({ name: "tasks" })
export class TasksEntity extends BaseEntity {
	@Column({ type: "integer" })
	manager_id!: number;

	@ManyToOne(() => UserEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "manager_id" })
	manager!: UserEntity;

	@Column({ nullable: false, type: "varchar" })
	comment!: string;

	@Column({ nullable: false, type: "text", enum: TaskType })
	task_type!: TaskType;

	@Column({ type: "integer", nullable: false })
	client_id!: number;

	@ManyToOne(() => ClientEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "client_id" })
	client?: ClientEntity;

	@Column({ type: "integer", nullable: false })
	lead_id!: number;

	@ManyToOne(() => LeadsEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "lead_id" })
	lead!: LeadsEntity;

	@Column({ type: "integer", nullable: false })
	project_id!: number;

	@ManyToOne(() => ProjectEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({
		type: "timestamp without time zone",
		nullable: false,
	})
	end_date!: Date;

	@Column({
		type: "timestamp without time zone",
		nullable: true,
		default: () => "CURRENT_TIMESTAMP",
	})
	start_date!: Date;

	@Column({ type: "varchar", enum: TaskStatus, default: TaskStatus.PENDING })
	status!: TaskStatus;
}
