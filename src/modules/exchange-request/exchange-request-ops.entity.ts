import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

import { ExchangeRequestEntity } from "./exchange-request.entity";

export enum ExchangeRequestStatus {
	NOT_PROCESSED = "Не обработана",
	NEW = "Новая",
	GRADE = "Оценка",
	CONTRACT = "Составление договора",
	BILL = "Формирование векселя",
	COMPLETE = "Выиграна",
	FAILED = "Проиграна",
}

@Entity({ name: "exchange_request_ops" })
export class ExchangeRequestOpsEntity extends BaseEntity {
	@ManyToOne(
		() => ExchangeRequestEntity,
		(type) => type.exchange_request_ops,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	@JoinColumn({ name: "exchange_request_id" })
	exchange_request!: ExchangeRequestEntity;

	@Column({ type: "integer" })
	exchange_request_id!: number;

	@Column({
		enum: ExchangeRequestStatus,
		default: ExchangeRequestStatus.NOT_PROCESSED,
	})
	status!: ExchangeRequestStatus;
}
