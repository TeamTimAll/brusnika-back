import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { SectionEntity } from "../sections.entity";

type ISectionDto = Omit<SectionEntity, "ext_id" | "building" | "premises">;

export class SectionDto implements ISectionDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	building_id?: number;

	@ApiProperty()
	is_active!: boolean;
}

export class SectionMetaDataDto extends BaseDto<SectionDto> implements Dto {
	@ApiProperty({ type: SectionDto })
	declare data: SectionDto;

	desc = "string";
}
