import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	VirtualColumn,
} from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { RoleType } from "../../constants";
import { UseDto } from "../../decorators";
import { AgenciesEntity } from "../../modules/agencies/agencies.entity";
import { CommentEntity } from "../../modules/comments/comment.entity";
import { TrainingEntity } from "../../modules/training/training.entity";
import { CitiesEntity } from "../cities/cities.entity";
import { ClientEntity } from "../client/client.entity";
import { EventsEntity } from "../events/events.entity";
import { NewsEntity } from "../news/news.entity";

import { UserDto } from "./dtos/user.dto";

export enum UserRegisterStatus2 {
	CREATED = "created",
	FILLED = "filled",
	FINISHED = "finished",
}

@Entity({ name: "users2" })
@UseDto(UserDto)
export class User2Entity extends AbstractEntity<UserDto> {
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

	@Column({ nullable: true, type: "varchar" })
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
		enum: UserRegisterStatus2,
		default: UserRegisterStatus2.CREATED,
	})
	register_status!: UserRegisterStatus2;

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

	@OneToMany(() => EventsEntity, (eventsEntity) => eventsEntity.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	events?: EventsEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	comments?: CommentEntity[];

	@OneToMany(() => NewsEntity, (news) => news.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	news?: NewsEntity[];

	// @OneToMany(() => ProjectEntity, (project) => project.user, {
	//   onDelete: 'CASCADE',
	//   onUpdate: 'CASCADE',
	// })
	// projects?: ProjectEntity[];

	@OneToMany(() => ClientEntity, (client) => client.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	clients?: ClientEntity[];

	@OneToMany(() => TrainingEntity, (train) => train.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	trainings?: TrainingEntity[];

	@ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CitiesEntity;

	@Column({ nullable: true })
	city_id?: string;

	@ManyToOne(() => AgenciesEntity, (agency) => agency.user)
	@JoinColumn({ name: "agency_id" })
	agency!: AgenciesEntity;

	@Column({ nullable: true })
	agency_id?: string;

	static toDto(
		entity: Partial<WithOutToDto<User2Entity>>,
	): WithOutToDto<User2Entity> {
		const dto: WithOutToDto<User2Entity> = {
			id: entity.id ?? "",
			firstName: entity.firstName ?? "",
			lastName: entity.lastName ?? "",
			role: entity.role ?? RoleType.USER,
			email: entity.email ?? "",
			username: entity.username ?? "",
			password: entity.password ?? "",
			phone: entity.phone ?? "",
			birthDate: entity.birthDate ?? new Date(),
			workStartDate: entity.workStartDate ?? new Date(),
			verification_code: entity.verification_code ?? 0,
			verification_code_sent_date:
				entity.verification_code_sent_date ?? new Date(),
			avatar: entity.avatar ?? "",
			register_status:
				entity.register_status ?? UserRegisterStatus2.CREATED,
			fullName: entity.fullName ?? "",
			isPhoneVerified: entity.isPhoneVerified ?? true,
			temporaryNumber: entity.temporaryNumber ?? "",
			status: entity.status ?? true,
			events: entity.events ?? [],
			comments: entity.comments ?? [],
			news: entity.news ?? [],
			clients: entity.clients ?? [],
			trainings: entity.trainings ?? [],
			city: entity.city ?? new CitiesEntity(),
			city_id: entity.city_id ?? "",
			agency: entity.agency ?? new AgenciesEntity(),
			agency_id: entity.agency_id ?? "",
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
		};

		return dto;
	}
}
