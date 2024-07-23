import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from "class-validator";

export class InviteUsersDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;

	@ApiProperty({ default: [1, 2, 3, 4] })
	@IsArray()
	@IsInt({ each: true })
	@ArrayMinSize(1)
	user_ids!: number[];
}
