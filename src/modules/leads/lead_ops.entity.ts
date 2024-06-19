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
	FAILED = "проиграна",
}

@Entity({ name: "lead_ops" })
@UseDto(LeadsDto)
export class LeadOpsEntity extends AbstractEntity<LeadsDto> {
	@ManyToOne(() => LeadsEntity, (type) => type.lead_ops)
	@JoinColumn({ name: "lead_id" })
	lead!: LeadsEntity;

	@Column()
	lead_id!: string;

	@Column({ enum: LeadOpStatus })
	status!: LeadOpStatus;
}
