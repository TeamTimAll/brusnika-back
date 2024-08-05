import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class DeleteUserInvitationDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class DeleteUserInvitationMetaDataDto extends BaseDto<DeleteUserInvitationDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(DeleteUserInvitationDto) }],
		type: () => DeleteUserInvitationDto,
	})
	@ValidateNested()
	@Type(() => DeleteUserInvitationDto)
	declare data: DeleteUserInvitationDto;
}
