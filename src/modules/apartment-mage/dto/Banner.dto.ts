import { ApiProperty } from "@nestjs/swagger";

import { BaseDto } from "../../../common/base/base_dto";
import { ApartmentImageEntity } from "../apartment-image.entity";

export class ApartmentImageDto implements Required<ApartmentImageEntity> {
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
	image!: string;
}

export class ApartmentImageMetaDataDto extends BaseDto<ApartmentImageDto> {
	@ApiProperty({ type: ApartmentImageDto })
	declare data: ApartmentImageDto;
}

export class ApartmentImagesMetaDataDto extends BaseDto<ApartmentImageDto> {
	@ApiProperty({ type: ApartmentImageDto, isArray: true })
	declare data: ApartmentImageDto;
}
