import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BookingsEntity } from "../bookings/bookings.entity";
import { LeadsEntity } from "../leads/leads.entity";
import { UserEntity } from "../user/user.entity";
import { VisitsEntity } from "../visits/visits.entity";

export enum FixingType {
	LEAD_VERIFICATION = "проверка лида",
	CENCEL_FIXING = "отказ в закреплении",
	WEAK_FIXING = "слабое закрепление",
	STRONG_FIXING = "сильное закрепление",
}

export enum ConfirmationType {
	PHONE = "звонок",
	SMS = "смс",
}

@Entity({ name: "clients" })
export class ClientEntity extends BaseEntity {
	@Column({ type: "varchar", length: 255 })
	fullname!: string;

	@Column({ type: "varchar", length: 15 })
	phone_number!: string;

	@Column({ type: "timestamp", nullable: true })
	actived_date?: Date | null;

	@Column({ type: "timestamp", nullable: true })
	fixing_type_updated_at?: Date;

	@Column({ type: "text", nullable: true })
	comment?: string;

	@Column({
		type: "enum",
		enum: ConfirmationType,
		default: ConfirmationType.PHONE,
	})
	confirmation_type!: ConfirmationType;

	@Column({
		type: "enum",
		enum: FixingType,
		nullable: true,
		default: FixingType.LEAD_VERIFICATION,
	})
	fixing_type?: FixingType;

	@Column({ type: "timestamp", nullable: true })
	expiration_date!: Date;

	@Column({ type: "text", nullable: true })
	node?: string;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ type: "integer" })
	agent_id!: number;

	@OneToMany(() => LeadsEntity, (l) => l.client, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	leads?: LeadsEntity[];

	@OneToMany(() => BookingsEntity, (Bookings) => Bookings.client, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	bookings?: BookingsEntity[];

	@OneToMany(() => VisitsEntity, (VisitsEntity) => VisitsEntity.project, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	visits?: VisitsEntity[];
}
