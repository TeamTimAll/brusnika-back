import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class LikeEventDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	id!: number;
}
