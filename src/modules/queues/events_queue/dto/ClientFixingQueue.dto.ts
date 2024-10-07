import { IsEnum, IsString } from "class-validator";

import { FixingType } from "../../../client/client.entity";

export class ClientFixingQueueDto {
	@IsString()
	ext_id!: string;

	@IsString()
	client_ext_id!: string;

	@IsEnum(FixingType)
	fixing_type!: FixingType;
}
