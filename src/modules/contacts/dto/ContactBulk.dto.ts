import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { CreateContactDto } from "./CreateContact.dto";
import { UpdateContactDto } from "./UpdateContact.dto";

export class CreateContactBulkDto extends CreateContactDto {}

export class UpdateContactBulkDto extends UpdateContactDto {
	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class ContactBulkDto {
	@ApiProperty({ type: CreateContactBulkDto, isArray: true })
	@Type(() => CreateContactBulkDto)
	@IsDefined()
	@ValidateNested({ each: true })
	create!: CreateContactBulkDto[];

	@ApiProperty({ type: UpdateContactBulkDto, isArray: true })
	@Type(() => UpdateContactBulkDto)
	@IsDefined()
	@ValidateNested({ each: true })
	update!: UpdateContactBulkDto[];

	@ApiProperty({ isArray: true })
	@Type(() => Number)
	@IsInt({ each: true })
	@IsDefined()
	delete!: number[];
}

export class ContactBulkMetaDataDto extends BaseDto<ContactBulkDto> {
	@ApiProperty({ type: ContactBulkDto })
	@Type(() => ContactBulkDto)
	@IsDefined()
	@ValidateNested()
	declare data: ContactBulkDto;
}
