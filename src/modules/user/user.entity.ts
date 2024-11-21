import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	VirtualColumn,
} from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { RoleType } from "../../constants";
import { AgencyEntity } from "../agencies/agencies.entity";
import { BookingsEntity } from "../bookings/bookings.entity";
import { CityEntity } from "../cities/cities.entity";
import { VisitsEntity } from "../visits/visits.entity";

export enum UserRegisterStatus {
	CREATED = "created",
	FILL_DATA = "fill_data",
	ATTACHMENT = "attachment",
	FINISHED = "finished",
}

export enum UserStatus {
	ACTIVE = "active",
	BLOCKED = "blocked",
}

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	firstName!: string | null;

	@Column({ nullable: true, type: "varchar" })
	keycloak_id?: string | null;

	@Column({ nullable: true, type: "varchar" })
	lastName!: string | null;

	@Column({ type: "enum", enum: RoleType, default: RoleType.NEW_MEMBER })
	role!: RoleType;

	@Column({ unique: true, nullable: true, type: "varchar" })
	email?: string | null;

	@Column({ unique: true, nullable: true, type: "varchar" })
	username!: string | null;

	@Column({ nullable: true, type: "varchar" })
	password!: string | null;

	@Column({ nullable: true, type: "varchar", unique: true })
	phone!: string | null;

	@Column({ nullable: true, type: "date" })
	birthDate!: Date | null;

	@Column({ nullable: true, type: "date" })
	workStartDate!: Date | null;

	@Column({ nullable: true, type: "int" })
	verification_code!: number | null;

	@Column({ nullable: true, type: "timestamp" })
	verification_code_sent_date!: Date | null;

	@Column({ nullable: true, type: "int" })
	email_verification_code!: number | null;

	@Column({ nullable: true, type: "timestamp" })
	email_verification_code_sent_date!: Date | null;

	@Column({ nullable: true, type: "varchar" })
	avatar!: string | null;

	@Column({
		type: "enum",
		enum: UserRegisterStatus,
		default: UserRegisterStatus.CREATED,
	})
	register_status!: UserRegisterStatus;

	@VirtualColumn({
		query: (alias) =>
			`SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
	})
	fullName!: string;

	@Column({ default: false })
	is_phone_verified?: boolean;

	@Column({ default: false })
	is_email_verified?: boolean;

	@Column({ default: false })
	is_verified?: boolean;

	@Column({ nullable: true, type: "enum", enum: RoleType })
	temporary_role?: RoleType;

	@Column({ nullable: true, type: "varchar" })
	temporary_number?: string | null;

	@Column({ nullable: true, type: "varchar" })
	temporary_email?: string | null;

	@Column({ nullable: true, type: "text" })
	firebase_token?: string;

	@Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
	status!: UserStatus;

	@ManyToOne(() => CityEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CityEntity;

	@Column({ type: "integer", nullable: true })
	city_id?: number;

	@ManyToOne(() => AgencyEntity, (agency) => agency.user)
	@JoinColumn({ name: "agency_id" })
	agency!: AgencyEntity;

	@Column({ type: "integer", nullable: true })
	agency_id?: number;

	@OneToMany(() => BookingsEntity, (Bookings) => Bookings.agent)
	bookings?: BookingsEntity[];

	@OneToMany(() => VisitsEntity, (VisitsEntity) => VisitsEntity.agent)
	visits?: VisitsEntity[];
}
