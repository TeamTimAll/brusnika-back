import { ApiProperty } from "@nestjs/swagger";
import { Uuid } from "boilerplate.polyfill";
import { IsString, IsUUID } from "class-validator";

export class CreateSectionsDto {
	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	name!: string;

	@IsUUID()
	@ApiProperty({ required: false, description: "Building ID" })
	building_id?: Uuid;
}
