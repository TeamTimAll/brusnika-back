import { IsString } from "class-validator";

export class TimeSlotsQueueDto {
	@IsString()
	ext_id!: string;
}
