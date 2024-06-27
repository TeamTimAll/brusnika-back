import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { v4 as uuid } from "uuid";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { Order } from "../../../constants";
import { Limit, Page } from "../../../decorators/pagination";
import { ClientEntity } from "../../client/client.entity";
import { PremisesEntity } from "../../premises/premises.entity";
import { ProjectEntity } from "../../projects/project.entity";
import { UserEntity } from "../../user/user.entity";
import { LeadOpStatus, LeadOpsEntity, PremisesType } from "../lead_ops.entity";
import { LeadState, LeadsEntity } from "../leads.entity";

export class LeadsDto extends BaseDto {}

export class LeadReadAll implements Omit<LeadsEntity, "toDto"> {
	@ApiProperty({ default: uuid() })
	id!: string;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	client_id?: string;

	@ApiProperty()
	agent!: UserEntity;

	@ApiProperty()
	agent_id?: string;

	@ApiProperty()
	manager?: UserEntity;

	@ApiProperty()
	manager_id?: string;

	@ApiProperty()
	project!: ProjectEntity;

	@ApiProperty()
	project_id?: string;

	@ApiProperty()
	premise!: PremisesEntity;

	@ApiProperty()
	premise_id?: string;

	@ApiProperty()
	fee?: number;

	@ApiProperty()
	current_status!: LeadOpStatus;

	@ApiProperty()
	lead_number!: number;

	@ApiProperty({ enum: LeadState })
	state!: LeadState;

	@ApiProperty()
	lead_ops?: LeadOpsEntity[];

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;
}

export class LeadReadByFilter {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUUID()
	project_id?: string;

	@ApiProperty({ required: false, enum: PremisesType })
	@IsOptional()
	@IsEnum(PremisesType)
	premise_type?: PremisesType;

	@ApiProperty({ required: false, enum: LeadOpStatus })
	@IsOptional()
	@IsEnum(LeadOpStatus)
	status?: LeadOpStatus;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	client_fullname?: string;

	@ApiProperty({ required: false, enum: Order })
	@IsOptional()
	@IsEnum(Order)
	createdAt?: Order;
}
