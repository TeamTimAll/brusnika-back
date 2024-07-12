import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteClientDto {
	@ApiProperty({ type: Number })
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	client_id!: number;
}
