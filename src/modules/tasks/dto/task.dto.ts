import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { TasksEntity, TaskStatus, TaskType } from "../tasks.entity";
import { ClientEntity } from "../../client/client.entity";
import { LeadsEntity } from "../../leads/leads.entity";
import { UserEntity } from "../../user/user.entity";
import { ProjectEntity } from "../../projects/project.entity";

type ITasksEntity = Omit<TasksEntity, "ext_id">;

export class TasksDto implements ITasksEntity {
	@ApiProperty()
	client!: ClientEntity;

	@ApiProperty()
	client_id!: number;

	@ApiProperty()
	comment!: string;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	end_date!: Date;

	@ApiProperty()
	id!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	lead!: LeadsEntity;

	@ApiProperty()
	lead_id!: number;

	@ApiProperty()
	project!: ProjectEntity;

	@ApiProperty()
	project_id!: number;

	@ApiPropertyOptional()
	result?: string;

	@ApiProperty()
	start_date!: Date;

	@ApiProperty()
	status!: TaskStatus;

	@ApiProperty()
	task_type!: TaskType;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	manager_id!: number;

	@ApiProperty()
	manager!: UserEntity;
}

export class TasksMetaDataDto extends BaseDto<TasksDto> implements Dto {
	@ApiProperty({ type: TasksDto })
	declare data: TasksDto;

	desc = "### Tasks ma'lumotlari";
}
