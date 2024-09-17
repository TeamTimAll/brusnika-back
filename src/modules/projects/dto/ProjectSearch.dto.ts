import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { Limit, Page } from "../../../decorators";

export class ProjectSearchDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 10;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	text!: string;
}
