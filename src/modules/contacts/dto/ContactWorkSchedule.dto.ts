import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { RussianWeekdaysString } from "../../../common/enums/weekdays";
import { ContactWorkScheduleEntity } from "../contact_work_schedule.entity";

type IContactWorkScheduleDto = Omit<
	ContactWorkScheduleEntity,
	"id" | "is_active" | "created_at" | "updated_at" | "contact"
>;

export class ContactWorkScheduleDto implements IContactWorkScheduleDto {
	@ApiProperty({ enum: RussianWeekdaysString })
	@IsEnum(RussianWeekdaysString)
	@IsNotEmpty()
	weekday!: RussianWeekdaysString;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	start_time!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	end_time!: string;

	contact_id!: number;
}
