import {
	IsDateString,
	IsEnum,
	IsMilitaryTime,
	IsString,
} from "class-validator";

import { VisitStatus } from "../../../visits/visits.entity";

export class VisitQueueDto {
	@IsString()
	ext_id!: string | null;

	@IsString()
	project_ext_id?: string | null;

	@IsString()
	client_ext_id?: string | null;

	@IsString()
	agent_ext_id?: string | null;

	@IsDateString()
	request_date!: Date | null;

	@IsMilitaryTime()
	request_time!: Date | null;

	@IsString()
	note?: string;

	@IsDateString()
	date!: Date;

	@IsMilitaryTime()
	time!: string;

	@IsEnum(VisitStatus)
	status!: VisitStatus;
}
