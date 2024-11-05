import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { BannerEntity } from "../banner.entity";

type IBannerEntity = Omit<
	BannerEntity,
	"id" | "ext_id" | "is_active" | "created_at" | "updated_at" | "city"
>;

export class CreateBannerDto implements IBannerEntity {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	cover_image!: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	link!: string;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	open_in_tab!: boolean;

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	city_id!: number;
}

export class CreateBannerMetaDataDto extends BaseDto<CreateBannerDto> {
	@ApiProperty({ type: CreateBannerDto })
	@ValidateNested()
	@Type(() => CreateBannerDto)
	declare data: CreateBannerDto;
}
