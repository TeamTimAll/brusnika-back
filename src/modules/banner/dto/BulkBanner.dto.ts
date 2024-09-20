import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { CreateBannerDto } from "./CreateBanner.dto";

export class BulkUpdateBannerDto extends PartialType(CreateBannerDto) {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id!: number;
}

export class BulkBannerDto {
	@ApiProperty({ type: CreateBannerDto, isArray: true })
	@ValidateNested({ each: true })
	@Type(() => CreateBannerDto)
	@IsDefined()
	create!: CreateBannerDto[];

	@ApiProperty({ type: BulkUpdateBannerDto, isArray: true })
	@ValidateNested({ each: true })
	@Type(() => BulkUpdateBannerDto)
	@IsDefined()
	update!: BulkUpdateBannerDto[];

	@ApiProperty({ isArray: true })
	@Type(() => Number)
	@IsInt({ each: true })
	@IsDefined()
	delete!: number[];
}

export class BulkBannerMetaDataDto extends BaseDto<BulkBannerDto> {
	@ApiProperty({ type: BulkBannerDto })
	@ValidateNested()
	@Type(() => BulkBannerDto)
	declare data: BulkBannerDto;
}
