import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

import { LeadsEntity } from "../leads.entity";

export class CreateLeadDto extends LeadsEntity {
	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsUUID("4")
	declare clinet_id: string;

	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsUUID("4")
	declare agent_id: string;

	@ApiProperty({ example: "uuidv4" })
	@IsOptional()
	@IsUUID("4")
	declare manager_id?: string;

	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsUUID("4")
	declare premise_id: string;

	@ApiProperty({ example: "uuidv4" })
	@IsNotEmpty()
	@IsInt()
	declare fee: number;
}
