import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateSectionsDto {
	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	name!: string;

	@ApiProperty({ required: false, description: "Building ID" })
	@Type(() => Number)
	@IsInt()
	building_id?: number;
}

export class CreateSectionsMetaDataDto extends BaseDto<CreateSectionsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateSectionsDto) }],
		type: () => CreateSectionsDto,
	})
	@ValidateNested()
	@Type(() => CreateSectionsDto)
	declare data: CreateSectionsDto;
}
