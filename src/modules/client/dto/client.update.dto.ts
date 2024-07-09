import { Type } from "class-transformer";
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

export class UpdateClientDto {
	@IsOptional()
	@IsString()
	fullName?: string;

	@IsOptional()
	@IsString()
	comment?: string;

	@IsOptional()
	phoneNumber?: string;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	projectId?: number;

	@IsOptional()
	@IsString()
	transactionStatus?: string;

	@IsOptional()
	@IsString()
	transactionStage?: string;

	@IsOptional()
	@IsDateString()
	establishmentDate?: Date;

	@IsOptional()
	pinningTypeId!: string;

	@IsOptional()
	@Type(() => Number)
	daysUntilEndOfAssignment?: number;

	@IsOptional()
	@IsString()
	managerNote?: string;

	@IsNotEmpty()
	clientId!: string;
}
