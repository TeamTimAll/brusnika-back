import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

import { Order } from "../../../constants";
import { Limit, Page } from "../../../decorators/pagination";
import { ClientEntity } from "../../client/client.entity";
import { PremisesEntity } from "../../premises/premises.entity";
import { ProjectEntity } from "../../projects/project.entity";
import { UserEntity } from "../../user/user.entity";
import { LeadOpStatus, LeadOpsEntity, PremisesType } from "../lead_ops.entity";
import { LeadState, LeadsEntity } from "../leads.entity";

export class LeadsDto {}

export class LeadReadAll implements LeadsEntity {
	@ApiProperty({ default: 1 })
	id!: number;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	client_id?: number;

	@ApiProperty()
	agent!: UserEntity;

	@ApiProperty()
	agent_id?: number;

	@ApiProperty()
	manager?: UserEntity;

	@ApiProperty()
	manager_id?: number;

	@ApiProperty()
	project!: ProjectEntity;

	@ApiProperty()
	project_id?: number;

	@ApiProperty()
	premise!: PremisesEntity;

	@ApiProperty()
	premise_id?: number;

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
	@IsInt()
	@Type(() => Number)
	project_id?: number;

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
	@IsInt()
	@Type(() => Number)
	client_id?: number;

	@ApiProperty({ required: false, enum: Order })
	@IsOptional()
	@IsEnum(Order)
	createdAt?: Order;
}
