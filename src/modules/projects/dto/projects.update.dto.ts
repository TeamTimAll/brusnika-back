import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDefined,
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	IsString,
	ValidateNested,
} from "class-validator";

import { MetaDto } from "../../../common/base/base_dto";

import {
	CreateProjectDto,
	CreateProjectMetaDataDto,
} from "./project.create.dto";

export class UpdateProjectMetaParams {
	// @ApiProperty({
	// 	required: false,
	// 	example: "e01286e7-ebb8-419f-96f7-9895aac17b4f",
	// })
	// @IsOptional()
	// @IsUUID()
	// user_id?: string;

	@ApiProperty({
		required: true,
		example: "e01286e7-ebb8-419f-96f7-9895aac17b4f",
	})
	@IsNotEmpty()
	@IsString()
	project_id!: string;
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
