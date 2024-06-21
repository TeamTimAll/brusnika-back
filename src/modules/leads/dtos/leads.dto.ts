import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuid } from "uuid";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { ClientEntity } from "../../client/client.entity";
import { PremisesEntity } from "../../premises/premises.entity";
import { ProjectEntity } from "../../projects/project.entity";
import { UserEntity } from "../../user/user.entity";
import { LeadOpsEntity } from "../lead_ops.entity";
import { LeadsEntity } from "../leads.entity";

export class LeadsDto extends BaseDto {}

export class LeadReadAll implements Omit<LeadsEntity, "toDto"> {
	@ApiProperty({ default: uuid })
	id!: string;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	clinet_id?: string;

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
	lead_ops?: LeadOpsEntity[];

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;
}
