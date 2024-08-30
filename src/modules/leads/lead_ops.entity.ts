import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

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
export class LeadOpsEntity extends BaseEntity {
	@ManyToOne(() => LeadsEntity, (type) => type.lead_ops, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "lead_id" })
	lead!: LeadsEntity;

	@Column({ type: "integer" })
	lead_id!: number;

	@Column({ enum: LeadOpStatus, default: LeadOpStatus.OPEN })
	status!: LeadOpStatus;
}
