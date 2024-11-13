import {
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
} from "class-validator";

import { TaskStatus, TaskType } from "../../../tasks/tasks.entity";

export class TaskDto {
	@IsString()
	ext_id!: string;

	@IsOptional()
	@IsString()
	comment?: string;

	@IsEnum(TaskType)
	task_type!: TaskType;

	@IsEnum(TaskStatus)
	status!: TaskStatus;

	@IsInt()
	client_ext_id!: string;

	@IsInt()
	project_ext_id!: string;

	@IsInt()
	manager_ext_id!: string;

	@IsInt()
	lead_ext_id!: string;

	@IsDateString()
	end_date!: Date;

	@IsDateString()
	@IsOptional()
	start_date?: Date;
}
