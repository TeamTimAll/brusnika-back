import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { ContactEntity } from "../contact.entity";

import { ContactAddressDto } from "./ContactAddress.dto";
import { ContactWorkScheduleDto } from "./ContactWorkSchedule.dto";

type IContact = Omit<ContactEntity, "city" | "work_schedule" | "address">;

export class ContactDto implements IContact {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	title!: string;

	@ApiProperty({ isArray: true })
	phone_number!: string[];

	@ApiProperty({ type: ContactAddressDto })
	address?: ContactAddressDto;

	@ApiProperty({ type: ContactWorkScheduleDto, isArray: true })
	work_schedule!: ContactWorkScheduleDto[];

	@ApiProperty()
	address_link?: string;

	@ApiProperty()
	city_id!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;
}

export class ContactMetaDataDto extends BaseDto<ContactDto> implements Dto {
	@ApiProperty({ type: ContactDto })
	@Type(() => ContactDto)
	@ValidateNested()
	@IsDefined()
	declare data: ContactDto;

	desc = "";
}

export class ContactArrayMetaDataDto
	extends BaseDto<ContactDto>
	implements Dto
{
	@ApiProperty({ type: ContactDto, isArray: true })
	@Type(() => ContactDto)
	@ValidateNested()
	@IsDefined()
	declare data: ContactDto;

	desc = "";
}
