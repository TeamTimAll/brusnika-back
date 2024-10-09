import { IsEnum, IsString } from "class-validator";

import { VisitStatus } from "../../../visits/visits.entity";

export class VisitQueueDto {
	@IsString()
	visit_ext_id!: string;

	@IsEnum(VisitStatus)
	status!: VisitStatus;
}
