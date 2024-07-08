import { ApiProperty } from "@nestjs/swagger";
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
	@ApiProperty({ required: false, description: "Building ID" })
	building_id?: number;
}
