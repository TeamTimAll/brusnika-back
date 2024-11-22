import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { ApartmentImageEntity } from "../apartment-image.entity";

type IApartmentImageEntity = Omit<
	ApartmentImageEntity,
	"id" | "ext_id" | "is_active" | "created_at" | "updated_at"
>;

export class CreateApartmentImageDto implements IApartmentImageEntity {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	image!: string;
}

export class CreateApartmentImageMetaDataDto extends BaseDto<CreateApartmentImageDto> {
	@ApiProperty({ type: CreateApartmentImageDto })
	@ValidateNested()
	@Type(() => CreateApartmentImageDto)
	declare data: CreateApartmentImageDto;
}
