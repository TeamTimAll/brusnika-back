import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";

import { LeadsDto } from "./dtos/leads.dto";
import { LeadsEntity } from "./leads.entity";

export enum LeadOpStatus {
	OPEN = "открыта",
	INTEREST_IN_PURCHASING = "интерес к покупке",
	PRESENTATION = "презентация",
	BOOKED = "бронь",
	REQUEST_FOR_CONTRACT = "заявка на договор",
	CONTRACT_IS_REGISTERED = "договор зарегистрирован",
	WON = "выиграна",
	BOOK_CANCELED = "отмененная бронь",
	LOST_BOOK = "слетевшая бронь",
	ON_PAUSE = "на паузе",
	CHECK_LEAD = "проверка лида",
	FAILED = "проиграна",
}

export enum PremisesType {
	APARTMENT = "apartment",
	STOREROOM = "storeroom",
	PARKING = "parking",
	COMMERCIAL = "commercial",
}

@Entity({ name: "lead_ops" })
@UseDto(LeadsDto)
export class LeadOpsEntity extends AbstractEntity<LeadsDto> {
	@ManyToOne(() => LeadsEntity, (type) => type.lead_ops)
	@JoinColumn({ name: "lead_id" })
	lead!: LeadsEntity;

	@Column({ type: "integer" })
	lead_id!: number;

	@Column({ enum: LeadOpStatus, default: LeadOpStatus.OPEN })
	status!: LeadOpStatus;
}
