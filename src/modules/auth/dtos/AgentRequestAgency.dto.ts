import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { CreateExistentAgenciesDto } from "../../agencies/dtos/CreateAgencies.dto";

export class AgentRequestAgencyDto extends CreateExistentAgenciesDto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;
}

export class AgentRequestAgencyMetaDataDto extends BaseDto<AgentRequestAgencyDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(AgentRequestAgencyDto) }],
		type: () => AgentRequestAgencyDto,
	})
	@ValidateNested()
	@Type(() => AgentRequestAgencyDto)
	declare data: AgentRequestAgencyDto;
}
