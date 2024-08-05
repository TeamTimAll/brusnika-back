import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsString } from "class-validator";

export class ClientSearchFromBmpsoftDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname!: string;

	@ApiProperty()
	@IsMobilePhone()
	@IsNotEmpty()
	phone_number!: string;
}
