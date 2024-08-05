import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class AcceptInvitionDto {
	@ApiProperty({})
	@IsInt()
	@IsNotEmpty()
	event_id!: number;

	@ApiProperty({})
	@IsBoolean()
	@IsNotEmpty()
	is_accepted!: boolean;
}

export class AcceptInvitionMetaDataDto extends BaseDto<AcceptInvitionDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(AcceptInvitionDto) }],
		type: () => AcceptInvitionDto,
	})
	@ValidateNested()
	@Type(() => AcceptInvitionDto)
	declare data: AcceptInvitionDto;
}
