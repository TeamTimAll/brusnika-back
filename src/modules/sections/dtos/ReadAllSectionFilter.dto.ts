import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

import { BaseDto, Dto } from "../../../common/base/base_dto";

import { SectionDto } from "./Sections.dto";

export class ReadAllSectionFilterDto {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	building_id!: number;
}

export class ReadAllSectionMetaDataDto
	extends BaseDto<SectionDto[]>
	implements Dto
{
	@ApiProperty({ type: [SectionDto] })
	declare data: SectionDto[];

	desc = "string";
}
