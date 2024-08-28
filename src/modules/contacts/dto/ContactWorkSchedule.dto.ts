import { ApiProperty } from "@nestjs/swagger";
import {
	IsEnum,
	IsMilitaryTime,
	IsNotEmpty,
	IsOptional,
} from "class-validator";

import { Weekdays } from "../../../common/enums/weekdays";
import { ContactWorkScheduleEntity } from "../contact_work_schedule.entity";

type IContactWorkScheduleDto = Omit<ContactWorkScheduleEntity, "contact">;

export class ContactWorkScheduleDto implements IContactWorkScheduleDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty({ enum: Weekdays })
	weekday!: Weekdays;

	@ApiProperty({ default: "00:00" })
	start_time!: string;

	@ApiProperty({ default: "00:00" })
	end_time!: string;

	@ApiProperty()
	contact_id!: number;
}

type ICreateContactWorkScheduleDto = Omit<
	ContactWorkScheduleEntity,
	| "id"
	| "is_active"
	| "created_at"
	| "updated_at"
	| "contact"
	| "start_time"
	| "end_time"
>;

export class CreateContactWorkScheduleDto
	implements ICreateContactWorkScheduleDto
{
	@ApiProperty({ enum: Weekdays })
	@IsEnum(Weekdays)
	@IsNotEmpty()
	weekday!: Weekdays;

	@ApiProperty({ default: "00:00" })
	@IsMilitaryTime()
	@IsOptional()
	start_time?: string;

	@ApiProperty({ default: "00:00" })
	@IsMilitaryTime()
	@IsOptional()
	end_time?: string;

	contact_id!: number;
}
