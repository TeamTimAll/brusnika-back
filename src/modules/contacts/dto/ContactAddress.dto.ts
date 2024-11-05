import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

import { ContactAddressEntity } from "../contact_address.entity";

type IContactAddressDto = Omit<
	ContactAddressEntity,
	"id" | "ext_id" | "is_active" | "created_at" | "updated_at" | "contact"
>;

export class ContactAddressDto implements IContactAddressDto {
	@ApiProperty()
	title!: string;

	@ApiProperty()
	lat?: string;

	@ApiProperty()
	long?: string;

	@ApiProperty()
	contact_id!: number;
}

export class CreateContactAddressDto implements IContactAddressDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	lat?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	long?: string;

	contact_id!: number;
}

export class UpdateContactAddressDto extends CreateContactAddressDto {
	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	id!: number;
}
