import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class AdminLoginAsUserDto {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	user_id!: number;
}

export class AdminLoginAsUserMetaDataDto extends BaseDto<AdminLoginAsUserDto> {
	@ApiProperty({ type: AdminLoginAsUserDto })
	@ValidateNested()
	@Type(() => AdminLoginAsUserDto)
	declare data: AdminLoginAsUserDto;
}
