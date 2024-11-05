import { Type } from "class-transformer";
import { IsEnum, ValidateNested } from "class-validator";

import { BaseDto } from "../../../../common/base/base_dto";

import { BookingQueueDto } from "./BookingQueue.dto";
import { BuildingQueueDto } from "./BuildingQueue.dto";
import { CityQueueDto } from "./CityQueue.dto";
import { ClientFixingQueueDto } from "./ClientFixingQueue.dto";
import { ClientQueueDto } from "./ClientQueue.dto";
import { LeadOpQueueDto } from "./LeadOpQueue.dto";
import { LeadQueueDto } from "./LeadQueue.dto";
import { PremiseQueueDto } from "./PremiseQueue.dto";
import { ProjectQueueDto } from "./ProjectQueue.dto";
import { SectionQueueDto } from "./SectionQueue.dto";
import { TimeSlotsQueueDto } from "./TimeSlotsQueue.dto";
import { UserQueueDto } from "./UserQueue.dto";
import { VisitQueueDto } from "./VisitQueue.dto";

export enum EventType {
	CITY = "city",
	PROJECT = "project",
	BUILDING = "building",
	SECTION = "section",
	PREMISE = "premise",
	LEAD = "lead",
	LEAD_OP = "lead_op",
	TIME_SLOTS = "time_slots",
	USER = "user",
	CLIENT = "client",
	CLIENT_FIXING = "client_fixing",
	BOOKING = "booking",
	VISIT = "VISIT",
}

export class EventsQueue {
	@IsEnum(EventType)
	type!: EventType;

	@Type((type) => {
		if (type?.object) {
			switch ((type.object as EventsQueue).type) {
				case EventType.PREMISE:
					return PremiseQueueDto;
				case EventType.CITY:
					return CityQueueDto;
				case EventType.PROJECT:
					return ProjectQueueDto;
				case EventType.BUILDING:
					return BuildingQueueDto;
				case EventType.SECTION:
					return SectionQueueDto;
				case EventType.LEAD:
					return LeadQueueDto;
				case EventType.LEAD_OP:
					return LeadOpQueueDto;
				case EventType.TIME_SLOTS:
					return TimeSlotsQueueDto;
				case EventType.USER:
					return UserQueueDto;
				case EventType.CLIENT:
					return ClientQueueDto;
				case EventType.CLIENT_FIXING:
					return ClientFixingQueueDto;
				case EventType.BOOKING:
					return BookingQueueDto;
				case EventType.VISIT:
					return VisitQueueDto;
			}
		}
		return PremiseQueueDto;
	})
	@ValidateNested()
	data!:
		| PremiseQueueDto
		| CityQueueDto
		| ProjectQueueDto
		| BuildingQueueDto
		| SectionQueueDto
		| LeadQueueDto
		| LeadOpQueueDto
		| TimeSlotsQueueDto
		| UserQueueDto
		| ClientQueueDto
		| ClientFixingQueueDto
		| BookingQueueDto
		| VisitQueueDto;
}

export class EventsQueueMessageMetaDataDto extends BaseDto<EventsQueue> {
	@ValidateNested()
	@Type(() => EventsQueue)
	declare data: EventsQueue;
}
