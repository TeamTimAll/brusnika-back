import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { ContactEntity } from "../contact.entity";

export class ContactDto
	implements
		Omit<
			ContactEntity,
			"id" | "event" | "event_id" | "createdAt" | "updatedAt" | "toDto"
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
