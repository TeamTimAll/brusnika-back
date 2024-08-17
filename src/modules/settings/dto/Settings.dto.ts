import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { SettingsEntity } from "../settings.entity";

export class SettingsDto implements SettingsEntity {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	booking_limit!: number;

	@ApiProperty()
	training_show_date_limit!: number;

	@ApiProperty()
	is_active!: boolean;
}

export class SettingsMetaDataDto extends BaseDto<SettingsDto> implements Dto {
	@ApiProperty({ type: SettingsDto })
	declare data: SettingsDto;

	desc = "";
}
