import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { CommercialStatus, PremisesType } from "../premises.entity";

export class CreatePremisesDto {
	@ApiProperty({ description: "Name of the premise", required: false })
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({ description: "Type of the premise", enum: PremisesType })
	@IsEnum(PremisesType)
	@IsNotEmpty()
	type: PremisesType | undefined;

	@ApiProperty({ description: "Building ID", required: false })
	@IsString()
	@IsOptional()
	building_id?: string;

	@ApiProperty({ description: "Price of the premise", required: false })
	@IsNumber()
	@IsOptional()
	price?: number;

	@ApiProperty({ description: "Size of the premise", required: false })
	@IsNumber()
	@IsOptional()
	size?: number;

	@ApiProperty({
		description: "Status of the commercial premise",
		enum: CommercialStatus,
		required: false,
	})
	@IsEnum(CommercialStatus)
	@IsOptional()
	status?: CommercialStatus;

	@ApiProperty({ description: "number", required: false })
	@IsNumber()
	@IsOptional()
	number?: number;

	@ApiProperty({ description: "Floor number", required: false })
	@IsNumber()
	@IsOptional()
	floor?: number;

	@ApiProperty({ description: "Photo URL", required: false })
	@IsString()
	@IsOptional()
	photo?: string;

	@ApiProperty({ description: "Number of rooms", required: false })
	@IsNumber()
	@IsOptional()
	rooms?: number;

	@ApiProperty({
		description: "Photos URLs",
		type: [String],
		required: false,
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	photos?: string[];

	@ApiProperty({
		description: "Number of similar apartments",
		required: false,
	})
	@IsNumber()
	@IsOptional()
	similiarApartmentCount?: number;

	@ApiProperty({ description: "Title of the premise", required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ description: "End date of the premise", required: false })
	@IsString()
	@IsOptional()
	end_date?: Date;

	@ApiProperty({ description: "Mortgage payment", required: false })
	@IsNumber()
	@IsOptional()
	mortagePayment?: number;

	@ApiProperty({ description: "Section ID", required: false })
	@IsString()
	@IsOptional()
	section_id?: string;
}
