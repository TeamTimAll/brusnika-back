import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";
import { NewsEntity } from "../news.entity";

type INewsEntity = Omit<
	NewsEntity,
	| "ext_id"
	| "views"
	| "likes"
	| "city"
	| "secondary_category"
	| "primary_category"
>;

export class NewsDto implements INewsEntity {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	user_id!: number;

	@ApiProperty()
	cover_image!: string;

	@ApiProperty()
	is_like_enabled!: boolean;

	@ApiProperty()
	is_extra_like_enabled!: boolean;

	@ApiProperty()
	extra_like_icon!: string;

	@ApiProperty()
	published_at!: Date;

	@ApiProperty({ enum: RoleType })
	access?: RoleType;

	@ApiProperty()
	is_banner!: boolean;

	@ApiProperty()
	is_draft!: boolean;

	@ApiProperty()
	primary_category_id?: number;

	@ApiProperty()
	second_category_id?: number;

	@ApiProperty()
	city_id?: number;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	content!: string;

	@ApiProperty()
	coverImage!: string;
}

export class NewsMetaDataDto extends BaseDto<NewsDto> implements Dto {
	@ApiProperty({ type: NewsDto })
	declare data: NewsDto;

	desc = "### News ma'lumotlari";
}
