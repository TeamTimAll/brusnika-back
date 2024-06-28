import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDate,
	IsEnum,
	IsMilitaryTime,
	IsOptional,
	IsUUID,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { VisitStatus } from "../visits.entity";

export class CreateVisitsDto {
	@ApiProperty({ required: false, description: "ID of premise" })
	@IsUUID()
	premise_id?: string;

	@ApiProperty({ required: false, description: "ID of client" })
	@IsUUID()
	client_id?: string;

	@ApiProperty({ required: false, description: "ID of agent" })
	@IsUUID()
	@IsOptional()
	agent_id?: string;

	@ApiProperty({ required: true, description: "Date of booking" })
	@IsDate()
	date!: Date;

	@ApiProperty({
		required: true,
		default: "19:00",
		description: "Time of booking",
	})
	@IsMilitaryTime()
	time!: Date;

	// @ApiProperty({
	// 	required: true,
	// 	description: "Purchase option",
	// 	enum: PuchaseOptions,
	// })
	// @IsEnum(PuchaseOptions)
	// @IsOptional()
	// purchase_option?: PuchaseOptions;

	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: VisitStatus,
	})
	@IsOptional()
	@IsEnum(VisitStatus)
	status?: VisitStatus;
}

export class CreateVisitsMetaDataDto extends BaseDto<CreateVisitsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateVisitsDto) }],
		type: () => CreateVisitsDto,
	})
	@ValidateNested()
	@Type(() => CreateVisitsDto)
	declare data: CreateVisitsDto;
}
