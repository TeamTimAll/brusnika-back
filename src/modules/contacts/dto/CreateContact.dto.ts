import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsDefined, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { ContactDto } from "./Contact.dto";
import { ContactWorkScheduleDto } from "./ContactWorkSchedule.dto";

type ICreateContactDto = Omit<
	ContactDto,
	"id" | "is_active" | "created_at" | "updated_at"
>;

export class CreateContactDto implements ICreateContactDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	phone_number!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	address?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	address_link?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	email?: string;

	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	city_id!: number;

	@ApiProperty({ type: ContactWorkScheduleDto, isArray: true })
	@Type(() => ContactWorkScheduleDto)
	@ValidateNested({ each: true })
    @ArrayMinSize(0)
    @IsDefined()
	work_schedule!: ContactWorkScheduleDto[];
}

export class CreateContactMetaDataDto extends BaseDto<CreateContactDto> {
	@ApiProperty({ type: CreateContactDto })
	@Type(() => CreateContactDto)
	@ValidateNested()
	declare data: CreateContactDto;
}
