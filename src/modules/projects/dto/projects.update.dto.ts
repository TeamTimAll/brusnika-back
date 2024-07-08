import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDefined,
	IsInt,
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	ValidateNested,
} from "class-validator";

import { MetaDto } from "../../../common/base/base_dto";

import {
	CreateProjectDto,
	CreateProjectMetaDataDto,
} from "./project.create.dto";

export class UpdateProjectMetaParams {
	@ApiProperty({
		required: true,
		example: 1,
	})
	@IsNotEmpty()
	@IsInt()
@Type(() => Number)
	project_id!: number;
}

export class UpdateProjectMetaDto extends MetaDto<UpdateProjectMetaParams> {
	@ApiProperty({ type: UpdateProjectMetaParams })
	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => UpdateProjectMetaParams)
	declare params: UpdateProjectMetaParams;
}

export class UpdateProjectDto extends CreateProjectDto {}

export class UpdateProjectMetaDataDto extends CreateProjectMetaDataDto {
	@ApiProperty({ type: UpdateProjectMetaDto })
	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => UpdateProjectMetaDto)
	declare meta: UpdateProjectMetaDto;
}
