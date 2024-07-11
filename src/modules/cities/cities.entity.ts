import { Column, Entity, OneToMany } from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { UserEntity } from "../../modules/user/user.entity";

@Entity({ name: "cities" })
export class CitiesEntity extends AbstractEntity {
	@Column({ nullable: true, type: "varchar" })
	name!: string;

	@OneToMany(() => UserEntity, (user) => user.city, {
		onDelete: "CASCADE",
	})
	users?: WithOutToDto<UserEntity>[];

	@Column({ nullable: false, type: "varchar", default: "0.00" })
	long!: string;

	@Column({ nullable: false, type: "varchar", default: "0.00" })
	lat!: string;

	static toDto(
		entity: Partial<WithOutToDto<CitiesEntity>>,
	): WithOutToDto<CitiesEntity> {
		const dto: WithOutToDto<CitiesEntity> = {
			id: entity.id ?? 0,
			name: entity.name ?? "",
			users: entity.users ?? [],
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
			long: entity.long ?? "",
			lat: entity.lat ?? "",
		};
		return dto;
	}
}
