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

@Entity({ name: "clients" })
export class ClientEntity extends BaseEntity {
	@Column({ type: "varchar", length: 255 })
	fullname!: string;

	@Column({ type: "varchar", length: 15 })
	phone_number!: string;

	@Column({ type: "timestamp" })
	actived_date!: Date;

	@Column({ type: "text", nullable: true })
	comment?: string;

	@Column({ type: "enum", enum: FixingType, nullable: true })
	fixing_type?: FixingType;

	@Column({ type: "timestamp" })
	expiration_date!: Date;

	@Column({ type: "text", nullable: true })
	node?: string;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	agent_id?: number;

	@OneToMany(() => LeadsEntity, (l) => l.client, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	leads?: LeadsEntity[];

	@OneToMany(() => BookingsEntity, (Bookings) => Bookings.client, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	bookings?: BookingsEntity[];

	@OneToMany(() => VisitsEntity, (VisitsEntity) => VisitsEntity.project, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	visits?: VisitsEntity[];
}
