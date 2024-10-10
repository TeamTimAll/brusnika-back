import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ClientEntity } from "../client/client.entity";
import { PremiseEntity } from "../premises/premises.entity";
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
export class BookingsEntity extends BaseEntity {
	@ManyToOne(
		() => PremiseEntity,
		(PremisesEntity: PremiseEntity) => PremisesEntity.bookings,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "premise_id" })
	premise!: PremiseEntity;

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

	// @Column({ type: "date" })
	// date!: Date;

	// @Column({ type: "time" })
	// time!: string;

	@Column({ type: "enum", enum: PuchaseOptions })
	purchase_option!: PuchaseOptions;

	@Column({ default: BookingStatus.OPEN, enum: BookingStatus })
	status!: BookingStatus;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "create_by_id" })
	create_by!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	create_by_id?: number;
}
