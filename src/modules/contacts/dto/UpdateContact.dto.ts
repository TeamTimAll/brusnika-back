import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsDefined,
	IsInt,
	IsNotEmpty,
	ValidateNested,
} from "class-validator";

import { UpdateContactAddressDto } from "./ContactAddress.dto";
import { CreateContactWorkScheduleDto } from "./ContactWorkSchedule.dto";
import { CreateContactDto } from "./CreateContact.dto";

export class UpdateContactWorkScheduleDto extends CreateContactWorkScheduleDto {
	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class UpdateContactDto extends CreateContactDto {
	@ApiProperty({ type: UpdateContactAddressDto })
	@Type(() => UpdateContactAddressDto)
	@ValidateNested()
	@IsNotEmpty()
	declare address: UpdateContactAddressDto;

	@ApiProperty({ type: UpdateContactWorkScheduleDto, isArray: true })
	@Type(() => UpdateContactWorkScheduleDto)
	@ValidateNested({ each: true })
	@ArrayMinSize(0)
	@IsDefined()
	declare work_schedule: UpdateContactWorkScheduleDto[];
}
