import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { ClientEntity } from "../client/client.entity";
import { PremisesEntity } from "../premises/premises.entity";
import { UserEntity } from "../user/user.entity";

export enum BookingStatus {
	OPEN = "open",
	SUCCESS = "success",
	FAIL = "fail",
}

export enum PuchaseOptions {
	MORTAGE = "mortage",
	INSTALLMENT = "installment",
	BILL = "bill",
	FULL_PAYMENT = "full_payment",
}

@Entity({ name: "bookings" })
export class BookingsEntity extends AbstractEntity {
	@ManyToOne(
		() => PremisesEntity,
		(PremisesEntity: PremisesEntity) => PremisesEntity.bookings,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "premise_id" })
	premise!: PremisesEntity;

	@Column({ nullable: true, type: "integer" })
	premise_id?: number;

	@ManyToOne(
		() => ClientEntity,
		(ClientEntity: ClientEntity) => ClientEntity.bookings,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "client_id" })
	client!: ClientEntity;

	@Column({ nullable: true, type: "integer" })
	client_id?: number;

	@ManyToOne(
		() => UserEntity,
		(UserEntity: UserEntity) => UserEntity.bookings,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	agent_id?: number;

	@Column({ type: "date" })
	date!: Date;

	@Column({ type: "time" })
	time!: string;

	@Column({ type: "enum", enum: PuchaseOptions })
	purchase_option!: PuchaseOptions;

	@Column({ default: BookingStatus.OPEN, enum: BookingStatus })
	status!: BookingStatus;

	static toDto(
		entity: Partial<WithOutToDto<BookingsEntity>>,
	): WithOutToDto<BookingsEntity> {
		const dto: WithOutToDto<BookingsEntity> = {
			id: entity.id ?? 0,
			premise: entity.premise ?? new PremisesEntity(),
			premise_id: entity.premise_id ?? 0,
			client: entity.client ?? new ClientEntity(),
			client_id: entity.client_id ?? 0,
			agent: entity.agent ?? new UserEntity(),
			agent_id: entity.agent_id ?? 0,
			date: entity.date ?? new Date(),
			time: entity.time ?? "00:00",
			purchase_option: entity.purchase_option ?? PuchaseOptions.BILL,
			status: entity.status ?? BookingStatus.OPEN,
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
		};
		return dto;
	}
}
