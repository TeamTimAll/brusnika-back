import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class AgentChooseAgencyDto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;

	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	agency_id!: number;

	@ApiProperty({
		required: true,
	})
	@IsDateString()
	startWorkDate!: Date;
}

export class AgentChooseAgencyMetaDataDto extends BaseDto<AgentChooseAgencyDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(AgentChooseAgencyDto) }],
		type: () => AgentChooseAgencyDto,
	})
	@ValidateNested()
	@Type(() => AgentChooseAgencyDto)
	declare data: AgentChooseAgencyDto;
}
