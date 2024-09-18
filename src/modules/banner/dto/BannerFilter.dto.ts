import { ApiProperty } from "@nestjs/swagger";

import { Limit, Page } from "../../../decorators";

export class BannerFilterDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;
}
