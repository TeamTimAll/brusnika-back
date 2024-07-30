import { ApiProperty } from "@nestjs/swagger";
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from "class-validator";

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

export class DeleteUserInvitationDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class JoinToEventDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;
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
