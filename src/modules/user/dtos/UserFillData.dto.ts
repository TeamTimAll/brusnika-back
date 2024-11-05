import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEmail,
	IsInt,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserFillDataDto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	id!: number;

	@ApiProperty({
		required: true,
	})
	@IsString()
	firstName!: string;

	@ApiProperty({
		required: true,
	})
	@IsString()
	lastName!: string;

	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	city_id!: number;

	@ApiProperty({ required: true })
	@IsDateString()
	birthDate!: Date;

	@ApiProperty({ required: true })
	@IsEmail()
	email!: string;
}

export class UserFillDataMetaDataDto extends BaseDto<UserFillDataDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserFillDataDto) }],
		type: () => UserFillDataDto,
	})
	@ValidateNested()
	@Type(() => UserFillDataDto)
	declare data: UserFillDataDto;
}
