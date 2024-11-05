import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserChangeAgencyDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	agency_id!: number;
}

export class UserChangeAgencyMetaDataDto extends BaseDto<UserChangeAgencyDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserChangeAgencyDto) }],
		type: () => UserChangeAgencyDto,
	})
	@ValidateNested()
	@Type(() => UserChangeAgencyDto)
	declare data: UserChangeAgencyDto;
}
