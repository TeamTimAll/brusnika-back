import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { SectionEntity } from "../sections.entity";

type ISectionDto = Omit<SectionEntity, "building" | "premises">;

export class SectionDto implements ISectionDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	building_id?: number;
}

export class SectionMetaDataDto extends BaseDto<SectionDto> implements Dto {
	@ApiProperty({ type: SectionDto })
	declare data: SectionDto;

	desc = "string";
}
