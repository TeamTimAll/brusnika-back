import { ApiProperty } from "@nestjs/swagger";

import { ClientEntity } from "../../client/client.entity";
import { PremiseEntity } from "../../premises/premises.entity";
import { ProjectEntity } from "../../projects/project.entity";
import { UserEntity } from "../../user/user.entity";
import { LeadOpStatus, LeadOpsEntity } from "../lead_ops.entity";
import { LeadState, LeadsEntity } from "../leads.entity";

export class LeadsDto implements Omit<LeadsEntity, "ext_id"> {
	@ApiProperty({ default: 1 })
	id!: number;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	client_id?: number;

	@ApiProperty()
	agent!: UserEntity;

	@ApiProperty()
	agent_id!: number;

	@ApiProperty()
	manager?: UserEntity;

	@ApiProperty()
	manager_id?: number;

	@ApiProperty()
	project!: ProjectEntity;

	@ApiProperty()
	project_id?: number;

	@ApiProperty()
	premise!: PremiseEntity;

	@ApiProperty()
	premise_id!: number;

	@ApiProperty()
	sign_nps_passed!: boolean;

	@ApiProperty()
	comment!: string;

	@ApiProperty()
	fee?: number;

	@ApiProperty()
	current_status!: LeadOpStatus;

	@ApiProperty()
	lead_number!: string;

	@ApiProperty({ enum: LeadState })
	state!: LeadState;

	@ApiProperty()
	lead_ops?: LeadOpsEntity[];

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	start_date!: Date;

	@ApiProperty()
	status_updated_at!: Date;

	@ApiProperty()
	is_active!: boolean;
}
