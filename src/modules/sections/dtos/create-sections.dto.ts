import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateSectionsDto {
	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	name!: string;

	@IsInt()
	@Type(() => Number)
	@ApiProperty({ required: false, description: "Building ID" })
	building_id?: number;
}
