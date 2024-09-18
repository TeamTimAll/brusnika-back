import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BannerEntity } from "../banner/banner.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: "cities" })
export class CityEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	name!: string;

	@OneToMany(() => UserEntity, (user) => user.city, {
		onDelete: "CASCADE",
	})
	users?: UserEntity[];

	@Column({ nullable: false, type: "varchar", default: "0.00" })
	long!: string;

	@Column({ nullable: false, type: "varchar", default: "0.00" })
	lat!: string;

	@OneToMany(() => BannerEntity, (b) => b.city, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	banner?: BannerEntity;
}
