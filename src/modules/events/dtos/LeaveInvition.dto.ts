import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class LeaveInvitionDto {
	@ApiProperty({})
	@IsInt()
	@IsNotEmpty()
	event_id!: number;
}

export class LeaveInvitionMetaDataDto extends BaseDto<LeaveInvitionDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(LeaveInvitionDto) }],
		type: () => LeaveInvitionDto,
	})
	@ValidateNested()
	@Type(() => LeaveInvitionDto)
	declare data: LeaveInvitionDto;
}
