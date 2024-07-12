import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsMilitaryTime,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { VisitStatus } from "../visits.entity";

export class UpdateVisitsDto {
	@ApiProperty({ required: false, description: "ID of premise" })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	project_id?: number;

	@ApiProperty({ required: false, description: "ID of client" })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	client_id?: number;

	@ApiProperty({ required: false, description: "ID of agent" })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	agent_id?: number;

	@ApiProperty({ required: true, description: "Date of booking" })
	@IsDateString()
	@IsOptional()
	date!: Date;

	@ApiProperty({
		required: true,
		default: "19:00",
		description: "Time of booking",
	})
	@IsMilitaryTime()
	@IsOptional()
	time!: Date;

	@ApiProperty()
	@IsOptional()
	@IsString()
	note?: string;

	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: VisitStatus,
	})
	@IsEnum(VisitStatus)
	@IsOptional()
	status?: VisitStatus;
}

export class UpdateVisitsMetaDataDto {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UpdateVisitsDto) }],
		type: () => UpdateVisitsDto,
	})
	@ValidateNested()
	@Type(() => UpdateVisitsDto)
	declare data: UpdateVisitsDto;
}
