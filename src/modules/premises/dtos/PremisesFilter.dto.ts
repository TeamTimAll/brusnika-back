import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNumberString,
	IsOptional,
} from "class-validator";

import { Limit, Page } from "../../../decorators/pagination";
import {
	CommercialStatus,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

export class PremisesFilterDto {
	id?: number;
	ids?: number[];

	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsDateString()
	endYear?: Date;

	@ApiProperty({
		enum: PremisesType,
		description: "Premises type",
		required: false,
	})
	@IsOptional()
	type?: PremisesType | undefined;

	@ApiProperty({
		example: 1,
		description: "Section ID",
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	section_id?: number;

	@ApiProperty({ example: 3, required: false })
	@IsOptional()
	@IsNumberString()
	rooms?: string;

	@ApiProperty({
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	project_id?: number;

	@ApiProperty({
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	building_id?: number;

	@ApiProperty({
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	city_id?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	season_id?: number;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_size?: string;

	@ApiProperty({ example: "50", required: false })
	@IsOptional()
	@IsNumberString()
	max_size?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_price?: string;

	@ApiProperty({ example: "50000000", required: false })
	@IsOptional()
	@IsNumberString()
	max_price?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_floor?: string;

	@ApiProperty({ example: "50", required: false })
	@IsOptional()
	@IsNumberString()
	max_floor?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_number?: string;

	@ApiProperty({ example: "50", required: false })
	@IsOptional()
	@IsNumberString()
	max_number?: string;

	@ApiProperty({ required: false, enum: CommercialStatus })
	@IsEnum(() => CommercialStatus)
	@IsOptional()
	status?: CommercialStatus;

	@ApiProperty({ required: false, enum: PuchaseOptions })
	@IsOptional()
	@IsEnum(PuchaseOptions)
	purchaseOption?: PuchaseOptions;
}
