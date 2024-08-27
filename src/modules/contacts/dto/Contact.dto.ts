import { ApiProperty } from "@nestjs/swagger";

import { ContactEntity } from "../contact.entity";

type IContact = Omit<ContactEntity, "city" | "work_schedule">;

export class ContactDto implements IContact {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	phone_number!: string;

	@ApiProperty()
	address?: string;

	@ApiProperty()
	address_link?: string;

	@ApiProperty()
	email?: string;

	@ApiProperty()
	city_id!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;
}
