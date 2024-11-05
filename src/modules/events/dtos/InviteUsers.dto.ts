import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsInt,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class InviteUsersDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;

	@ApiProperty({ default: 1 })
	@IsInt()
	@IsOptional()
	agency_id?: number;

	@ApiProperty({ default: [1, 2, 3, 4] })
	@IsArray()
	@IsInt({ each: true })
	@ArrayMinSize(0)
	user_ids!: number[];
}

export class InviteUsersMetaDataDto extends BaseDto<InviteUsersDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(InviteUsersDto) }],
		type: () => InviteUsersDto,
	})
	@ValidateNested()
	@Type(() => InviteUsersDto)
	declare data: InviteUsersDto;
}
