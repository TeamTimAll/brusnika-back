import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDate,
	IsEnum,
	IsMilitaryTime,
	IsOptional,
	IsUUID,
	ValidateNested,
} from "class-validator";

import { PuchaseOptions } from "../../premises/premises.entity";
import { BaseDto } from "../../../common/base/base_dto";
import { VisitStatus } from "../visits.entity";

export class CreateVisitsDto {
	@IsUUID()
	@ApiProperty({ required: false, description: "ID of premise" })
	premise_id?: string;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of client" })
	client_id?: string;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of agent" })
	agent_id?: string;

	@IsDate()
	@ApiProperty({ required: true, description: "Date of booking" })
	date!: Date;

	@IsMilitaryTime()
	@ApiProperty({ required: true, description: "Time of booking" })
	time!: Date;

	@IsEnum(PuchaseOptions)
	@ApiProperty({
		required: true,
		description: "Purchase option",
		enum: PuchaseOptions,
	})
	purchase_option!: PuchaseOptions;

	@IsOptional()
	@IsEnum(VisitStatus)
	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: VisitStatus,
	})
	status?: VisitStatus;
}

export class CreateVisitsMetaDataDto extends BaseDto<CreateVisitsDto> {
	@ValidateNested()
	@Type(() => CreateVisitsDto)
	declare data: CreateVisitsDto;
}
