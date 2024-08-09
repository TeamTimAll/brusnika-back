import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { ContactEntity } from "../entities/contact.entity";

export class ContactDto
	implements
		Omit<
			ContactEntity,
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
}
