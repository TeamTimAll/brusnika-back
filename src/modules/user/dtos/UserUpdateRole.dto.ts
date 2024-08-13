import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";

export class UserUpdateRoleDto {
	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	id!: number;

	@ApiProperty({ enum: RoleType })
	@IsEnum(RoleType)
	@IsNotEmpty()
	role!: RoleType;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	is_blocked?: boolean = true;
}

export class UserUpdateRoleMetaDataDto extends BaseDto<UserUpdateRoleDto> {
	@ApiProperty({ type: UserUpdateRoleDto })
	declare data: UserUpdateRoleDto;
}
