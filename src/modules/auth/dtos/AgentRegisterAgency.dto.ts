import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { CreateAgenciesDto } from "../../agencies/dtos/CreateAgencies.dto";

export class AgentRegisterAgencyDto extends CreateAgenciesDto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;

	@ApiProperty({
		required: true,
	})
	@IsBoolean()
	isOwner!: boolean;
}

export class AgentRegisterAgencyMetaDataDto extends BaseDto<AgentRegisterAgencyDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(AgentRegisterAgencyDto) }],
		type: () => AgentRegisterAgencyDto,
	})
	@ValidateNested()
	@Type(() => AgentRegisterAgencyDto)
	declare data: AgentRegisterAgencyDto;
}
