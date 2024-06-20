import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { LeadsEntity } from "../leads.entity";

export class CreateLeadDto extends LeadsEntity {
	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsUUID("4")
	declare clinet_id: string;

	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsUUID("4")
	declare agent_id: string;

	@ApiProperty({ example: "uuidv4" })
	@IsOptional()
	@IsUUID("4")
	declare manager_id?: string;

	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsUUID("4")
	declare premise_id: string;

	@ApiProperty({ example: "uuidv4" })
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
