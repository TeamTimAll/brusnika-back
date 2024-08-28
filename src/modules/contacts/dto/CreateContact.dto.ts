import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsDefined,
	IsInt,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { ContactDto } from "./Contact.dto";
import { CreateContactAddressDto } from "./ContactAddress.dto";
import { CreateContactWorkScheduleDto } from "./ContactWorkSchedule.dto";

type ICreateContactDto = Omit<
	ContactDto,
	"id" | "is_active" | "created_at" | "updated_at" | "work_schedule"
>;

export class CreateContactDto implements ICreateContactDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty({ isArray: true })
	@IsString({ each: true })
	@IsArray()
	@IsNotEmpty()
	phone_number!: string[];

	@ApiProperty({ type: CreateContactAddressDto })
	@Type(() => CreateContactAddressDto)
	@ValidateNested()
	@IsNotEmpty()
	address!: CreateContactAddressDto;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	address_link?: string;

	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	city_id!: number;

	@ApiProperty({ type: CreateContactWorkScheduleDto, isArray: true })
	@Type(() => CreateContactWorkScheduleDto)
	@ValidateNested({ each: true })
	@ArrayMinSize(0)
	@IsDefined()
	work_schedule!: CreateContactWorkScheduleDto[];
}

export class CreateContactMetaDataDto extends BaseDto<CreateContactDto> {
	@ApiProperty({ type: CreateContactDto })
	@Type(() => CreateContactDto)
	@ValidateNested()
	declare data: CreateContactDto;
}
