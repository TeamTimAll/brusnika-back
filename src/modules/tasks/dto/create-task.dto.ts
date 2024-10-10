import {
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { TaskType } from "../tasks.entity";

export class CreateTaskDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	manager_id!: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	comment!: string;

	@ApiProperty()
	@IsEnum(TaskType)
	@IsNotEmpty()
	task_type!: TaskType;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	client_id!: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	project_id!: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	premise_id!: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	lead_id!: number;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	end_date!: Date;

	@ApiPropertyOptional()
	@IsDateString()
	@IsOptional()
	start_date?: Date;
}

export class CreateTaskMetaDataDto extends BaseDto<CreateTaskDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateTaskDto) }],
		type: () => CreateTaskDto,
	})
	@ValidateNested()
	@Type(() => CreateTaskDto)
	declare data: CreateTaskDto;
}
