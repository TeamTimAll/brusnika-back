import { ApiProperty } from "@nestjs/swagger";

import { BaseDto } from "../../../common/base/base_dto";
import { SettingsEntity } from "../settings.entity";

type IUpdateSettings = Partial<
	Omit<SettingsEntity, "id" | "created_at" | "updated_at">
>;

export class UpdateSettingsDto implements IUpdateSettings {
	@ApiProperty()
	booking_limit?: number;

	@ApiProperty()
	training_show_date_limit?: number;
}

export class UpdateSettingsMetaDataDto extends BaseDto<UpdateSettingsDto> {
	@ApiProperty({ type: UpdateSettingsDto })
	declare data: UpdateSettingsDto;
}
