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
import { AgenciesEntity } from "../agencies/agencies.entity";
import { BookingsEntity } from "../bookings/bookings.entity";
import { CitiesEntity } from "../cities/cities.entity";
import { CommentEntity } from "../comments/comment.entity";
import { VisitsEntity } from "../visits/visits.entity";

export enum UserRegisterStatus {
	CREATED = "created",
	FILL_DATA = "fill_data",
	ATTACHMENT = "attachment",
	FINISHED = "finished",
}

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	firstName!: string | null;

	@Column({ nullable: true, type: "varchar" })
	lastName!: string | null;

	@Column({ type: "enum", enum: RoleType, default: RoleType.USER })
	role!: RoleType;

	@Column({ unique: true, nullable: true, type: "varchar" })
	email!: string | null;

	@Column({ unique: true, nullable: true, type: "varchar" })
	username!: string;

	@Column({ nullable: true, type: "varchar" })
	password!: string;

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
	isPhoneVerified?: boolean;

	@Column({ nullable: true, type: "varchar" })
	temporaryNumber!: string | null;

	@Column({ default: true })
	status!: boolean;

	// @OneToMany(() => EventsEntity, (eventsEntity) => eventsEntity.user, {
	// 	onDelete: "CASCADE",
	// 	onUpdate: "CASCADE",
	// })
	// events?: EventsEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	comments?: CommentEntity[];

	// @OneToMany(() => ProjectEntity, (project) => project.user, {
	//   onDelete: 'CASCADE',
	//   onUpdate: 'CASCADE',
	// })
	// projects?: ProjectEntity[];

	@ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CitiesEntity;

	@Column({ type: "integer", nullable: true })
	city_id?: number;

	@ManyToOne(() => AgenciesEntity, (agency) => agency.user)
	@JoinColumn({ name: "agency_id" })
	agency!: AgenciesEntity;

	@Column({ type: "integer", nullable: true })
	agency_id?: number;

	@OneToMany(() => BookingsEntity, (Bookings) => Bookings.agent)
	bookings?: BookingsEntity[];

	@OneToMany(() => VisitsEntity, (VisitsEntity) => VisitsEntity.agent)
	visits?: VisitsEntity[];
}
