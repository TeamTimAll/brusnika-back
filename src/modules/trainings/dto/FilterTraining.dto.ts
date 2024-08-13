import { ApiProperty } from "@nestjs/swagger";

export class FilterTrainingDto {
	@ApiProperty({ required: false })
	category_id?: number;
}
