import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";

import { NotificationDto } from "./Notification.dto";

export class ReadAllNotificationMetaDataDto
	extends BaseDto<NotificationDto[]>
	implements Dto
{
	@ApiProperty({ type: [NotificationDto] })
	declare data: NotificationDto[];

	desc = "string";
}
