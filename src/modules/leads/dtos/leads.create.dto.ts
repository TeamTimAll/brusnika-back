import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { LeadsEntity } from "../leads.entity";

export class CreateLeadDto extends LeadsEntity {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	declare client_id: number;

	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	declare agent_id: number;

	@ApiProperty({ example: 1 })
	@IsOptional()
	@IsInt()
	declare manager_id?: number;

	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	declare premise_id: number;

	@ApiProperty({ example: 0 })
	@IsNotEmpty()
	@IsInt()
	declare fee: number;
}

export class CreateLeadMetaDataDto extends BaseDto<CreateLeadDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateLeadDto) }],
		type: () => CreateLeadDto,
	})
	@ValidateNested()
	@Type(() => CreateLeadDto)
	declare data: CreateLeadDto;
}
