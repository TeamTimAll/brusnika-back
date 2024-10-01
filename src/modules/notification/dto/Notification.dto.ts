import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { NotificationEntity, NotificationType } from "../notification.entity";

export type INotificationDto = Omit<NotificationEntity, "user">;

class ObjectType {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	photo?: string;
}

export class NotificationDto implements INotificationDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	description?: string;

	@ApiProperty()
	type!: NotificationType;

	@ApiProperty()
	object_id!: number;

	@ApiProperty()
	is_read!: boolean;

	@ApiProperty()
	user_id?: number;

	@ApiProperty()
	photo?: string;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	object!: ObjectType;
}

export class NotificationMetaDataDto
	extends BaseDto<NotificationDto>
	implements Dto
{
	@ApiProperty({ type: NotificationDto })
	declare data: NotificationDto;

	desc = "string";
}
