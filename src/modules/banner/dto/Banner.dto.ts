import { ApiProperty } from "@nestjs/swagger";

import { BaseDto } from "../../../common/base/base_dto";
import { CityEntity } from "../../cities/cities.entity";
import { BannerEntity } from "../banner.entity";

export class BannerDto implements Required<BannerEntity> {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	ext_id!: string;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	cover_image!: string;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	link!: string;

	@ApiProperty()
	open_in_tab!: boolean;

	@ApiProperty()
	city!: CityEntity;

	@ApiProperty()
	city_id!: number;
}

export class BannerMetaDataDto extends BaseDto<BannerDto> {
	@ApiProperty({ type: BannerDto })
	declare data: BannerDto;
}

export class BannerArrayMetaDataDto extends BaseDto<BannerDto> {
	@ApiProperty({ type: BannerDto, isArray: true })
	declare data: BannerDto;
}
