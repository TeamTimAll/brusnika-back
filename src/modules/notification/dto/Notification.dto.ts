import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { NotificationEntity } from "../notification.entity";

export type INotificationDto = Omit<NotificationEntity, "user">;

export class NotificationDto implements INotificationDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	description?: string;

	@ApiProperty()
	type!: string;

	@ApiProperty()
	object_id!: number;

	@ApiProperty()
	is_read!: boolean;

	@ApiProperty()
	user_id?: number;
}

export class NotificationMetaDataDto
	extends BaseDto<NotificationDto>
	implements Dto
{
	@ApiProperty({ type: NotificationDto })
	declare data: NotificationDto;

	desc = "string";
}
