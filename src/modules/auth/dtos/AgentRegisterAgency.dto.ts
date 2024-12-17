import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { CreateAgenciesDto } from "../../agencies/dtos/CreateAgencies.dto";
import { CreateAgenciesV2Dto } from "../../agencies/dtos/CreateAgenciesV2.dto";

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

export class AgentRegisterAgencyV2Dto extends CreateAgenciesV2Dto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
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

export class AgentRegisterAgencyV2MetaDataDto extends BaseDto<AgentRegisterAgencyV2Dto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(AgentRegisterAgencyV2Dto) }],
		type: () => AgentRegisterAgencyV2Dto,
	})
	@ValidateNested()
	@Type(() => AgentRegisterAgencyV2Dto)
	declare data: AgentRegisterAgencyV2Dto;
}
