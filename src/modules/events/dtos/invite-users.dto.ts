import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
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

export class JoinToEventDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class JoinToEventMetaDataDto extends BaseDto<JoinToEventDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(JoinToEventDto) }],
		type: () => JoinToEventDto,
	})
	@ValidateNested()
	@Type(() => JoinToEventDto)
	declare data: JoinToEventDto;
}

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
