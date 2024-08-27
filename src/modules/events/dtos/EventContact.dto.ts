import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { EventContactEntity } from "../entities/event-contact.entity";

export class EventContactDto
	implements
		Omit<
			EventContactEntity,
			"id" | "event" | "event_id" | "created_at" | "updated_at"
		>
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	phone!: string;

	@ApiProperty()
	is_active!: boolean;
}
