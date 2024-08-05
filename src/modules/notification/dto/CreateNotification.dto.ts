import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { NotificationType } from "../notification.entity";

export class CreateNotificationDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	documentation!: string;

	@ApiProperty()
	@IsEnum(NotificationType)
	@IsNotEmpty()
	type!: NotificationType;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	object_id!: number;
}

export class CreateNotificationMetaDataDto extends BaseDto<CreateNotificationDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateNotificationDto) }],
		type: () => CreateNotificationDto,
	})
	@ValidateNested()
	@Type(() => CreateNotificationDto)
	declare data: CreateNotificationDto;
}
