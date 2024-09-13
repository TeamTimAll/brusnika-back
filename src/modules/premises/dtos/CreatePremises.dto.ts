import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { PremiseSchemaEntity } from "../premise_schema.entity";
import {
	CommercialStatus,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

type IPremiseSchemaDto = Omit<
	PremiseSchemaEntity,
	"id" | "is_active" | "created_at" | "updated_at" | "premise" | "premise_id"
>;

export class PremiseSchemaDto implements IPremiseSchemaDto {
	@ApiProperty({ description: "Angle must be between 0° and 360°" })
	@Type(() => Number)
	@IsInt()
	@Min(0)
	@Max(360)
	@IsOptional()
	sunrise_angle?: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	schema_image?: string;
}

export class CreatePremisesDto {
	@ApiProperty({ description: "Type of the premise", enum: PremisesType })
	@IsEnum(PremisesType)
	@IsNotEmpty()
	type!: PremisesType;

	@ApiProperty({ description: "Building ID", required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	building_id?: number;

	@ApiProperty({ description: "Price of the premise", required: false })
	@IsNumber()
	@IsOptional()
	price?: bigint;

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

	@ApiProperty()
	@IsString()
	@IsOptional()
	link?: string;

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

	@ApiProperty({ description: "End date of the premise", required: false })
	@IsString()
	@IsOptional()
	end_date?: Date;

	@ApiProperty({ description: "Mortgage payment", required: false })
	@IsNumber()
	@IsOptional()
	mortagePayment?: number;

	@ApiProperty({ description: "Section ID", required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	section_id?: number;

	@ApiProperty({
		description: "Purchase option",
		required: false,
		enum: PuchaseOptions,
		isArray: true,
	})
	@IsEnum(PuchaseOptions, { each: true })
	@IsOptional()
	purchaseOption?: PuchaseOptions[];

	@ApiProperty({ type: PremiseSchemaDto })
	@Type(() => PremiseSchemaDto)
	@ValidateNested()
	@IsOptional()
	schema?: PremiseSchemaDto;
}

export class CreatePremisesMetaDataDto extends BaseDto<CreatePremisesDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreatePremisesDto) }],
		type: () => CreatePremisesDto,
	})
	@ValidateNested()
	@Type(() => CreatePremisesDto)
	declare data: CreatePremisesDto;
}
