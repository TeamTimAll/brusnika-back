import { Column, Entity, ManyToOne } from "typeorm";

import { ClientEntity } from "../client/client.entity";
import { PremisesType } from "../premises/premises.entity";
import { BaseEntity } from "../../common/base/base.entity";

export enum AccommodationType {
	NO = "нет",
	MORE_THAN_3_MONTH = "больше 3х месяцев",
	LESS_THAN_3_MONTH = "меньше 3х месяцев",
}

export enum PremiseCondition {
	GOOD = "хорошее",
	SATISFACTORY = "удовлетворительное",
	BAD = "плохое",
}

export enum ExchangeRequestState {
	NOT_PROCESSED = "Не обработана",
	NEW = "Новая",
	GRADE = "Оценка",
	CONTRACT = "Составление договора",
	BILL = "Формирование векселя",
	COMPLETE = "Выиграна",
}

@Entity({ name: "exchange_request" })
export class ExchangeRequestEntity extends BaseEntity {
	@Column({ nullable: false })
	city!: string;

	@Column({ nullable: false })
	street!: string;

	@Column({ nullable: false })
	house_number!: number;

	@Column({ nullable: false, type: "enum", enum: PremisesType })
	premise_type!: PremisesType;

	@Column({ nullable: false, type: "enum", enum: AccommodationType })
	accommodation_type!: AccommodationType;

	@Column({ nullable: false, type: "enum", enum: PremiseCondition })
	premise_condition!: PremiseCondition;

	@Column({ nullable: false })
	apartment_number!: number;

	@Column({ nullable: false })
	construction_year!: number;

	@Column({ nullable: false })
	room_count!: number;

	@Column({ nullable: false })
	floor!: number;

	@Column({ nullable: false })
	number_of_floors!: number;

	@Column({ nullable: false })
	total_area!: number;

	@Column({ nullable: false })
	living_area!: number;

	@Column({ nullable: false })
	has_mortgage!: boolean;

	@Column({ nullable: false })
	has_encumbrances!: boolean;

	@Column({ nullable: false })
	client_price!: number;

	@Column({ nullable: false })
	agency_price!: number;

	@ManyToOne(() => ClientEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	client!: ClientEntity;

	@Column({ type: "integer", nullable: true })
	client_id!: number;

	@Column({ nullable: true })
	advertisement_link?: string;
}
