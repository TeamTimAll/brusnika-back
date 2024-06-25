import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { PremisesEntity, PuchaseOptions } from "../premises/premises.entity";
import { WithOutToDto } from "types";
import { ClientEntity } from "../client/client.entity";
import { UserEntity } from "../user/user.entity";

export enum BookingsStatus {
	OPEN = "открыто",
	SUCCESS = "успешно",
	FAIL = "неуспешно",
}

@Entity({ name: "bookings" })
export class BookingsEntity extends AbstractEntity {
	@ManyToOne(
		() => PremisesEntity,
		(PremisesEntity) => PremisesEntity.bookings,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "premise_id" })
	premise!: PremisesEntity;

	@Column({ nullable: true, type: "uuid" })
	premise_id?: string;

	@ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.bookings, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "client_id" })
	client!: ClientEntity;

	@Column({ nullable: true, type: "uuid" })
	client_id?: string;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.bookings, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "agent_id" })
	agent!: UserEntity;

	@Column({ nullable: true, type: "uuid" })
	agent_id?: string;

	@Column({ type: "date" })
	date!: Date;

	@Column({ type: "time" })
	time!: Date;

	@Column({ type: "enum", enum: PuchaseOptions })
	purchase_option!: PuchaseOptions;

	@Column({ default: BookingsStatus.OPEN, enum: BookingsStatus })
	status!: BookingsStatus;

	static toDto(
		entity: Partial<WithOutToDto<BookingsEntity>>,
	): WithOutToDto<BookingsEntity> {
		const dto: WithOutToDto<BookingsEntity> = {
			id: entity.id ?? "",
			premise: entity.premise ?? new PremisesEntity(),
			premise_id: entity.premise_id ?? "",
			client: entity.client ?? new ClientEntity(),
			client_id: entity.client_id ?? "",
			agent: entity.agent ?? new UserEntity(),
			agent_id: entity.agent_id ?? "",
			date: entity.date ?? new Date(),
			time: entity.time ?? new Date(),
			purchase_option: entity.purchase_option ?? PuchaseOptions.BILL,
			status: entity.status ?? BookingsStatus.OPEN,
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
		};
		return dto;
	}
}
