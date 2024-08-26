import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty } from "class-validator";

import { BaseDto, Dto } from "../../../common/base/base_dto";

export class UserVerifyDto {
	@ApiProperty()
	@IsBoolean()
	@IsNotEmpty()
	is_verified!: boolean;

	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	user_id!: number;
}

export class UserVerifyMetaDataDto
	extends BaseDto<UserVerifyDto>
	implements Dto
{
	@ApiProperty({ type: UserVerifyDto })
	declare data: UserVerifyDto;

	desc = "";
}
