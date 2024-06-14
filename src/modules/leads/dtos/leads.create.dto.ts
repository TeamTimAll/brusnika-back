import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { Uuid } from "boilerplate.polyfill";

export class LeadsCreateDto {
	@IsNotEmpty()
	@IsString()
	projectId!: Uuid;

	@IsNotEmpty()
	@IsString()
	clientId!: Uuid;

	@IsNotEmpty()
	@IsString()
	productType!: string;

	// @IsNotEmpty()
	// @IsString()
	// clientFullName !: string;
	// clientPhoneNumber!: string;

	@IsNotEmpty()
	@IsString()
	transactionNumber!: string;

	@IsNotEmpty()
	@IsString()
	transactionStatus!: string;

	@IsNotEmpty()
	@IsString()
	transactionStage!: string;

	@IsOptional()
	floor?: number;

	@IsOptional()
	roomNumber?: string;

	@IsNotEmpty()
	@IsNumber()
	cost!: number;

	@IsNotEmpty()
	@IsString()
	agentName!: string;

	@IsNotEmpty()
	@IsString()
	managerName!: string;
}
