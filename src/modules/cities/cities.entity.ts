import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../../modules/user/user.entity";

@Entity({ name: "cities" })
export class CitiesEntity extends BaseEntity {
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
}
