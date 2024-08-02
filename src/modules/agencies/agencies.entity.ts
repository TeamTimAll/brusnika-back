import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { CitiesEntity } from "../cities/cities.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: "agencies" })
export class AgencyEntity extends BaseEntity {
	@OneToMany(() => UserEntity, (userEntity) => userEntity.agency, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "userId" })
	user!: UserEntity[];

	@Column({ nullable: true, type: "varchar" })
	title!: string;

	@ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CitiesEntity;

	@Column({ type: "integer", nullable: true })
	city_id?: number;

	@Column({ nullable: true, type: "varchar" })
	legalName!: string | null;

	@Column({ nullable: true, type: "varchar" })
	inn!: string | null;

	@Column({ nullable: true, type: "varchar" })
	phone!: string | null;

	@Column({ nullable: true, type: "varchar" })
	email!: string | null;

	@Column({ nullable: true, type: "varchar" })
	ownerFullName!: string | null;

	@Column({ nullable: true, type: "varchar" })
	ownerPhone!: string | null;

	@Column({ nullable: true, type: "varchar" })
	entry_doc!: string | null;

	@Column({ nullable: true, type: "varchar" })
	company_card_doc!: string | null;

	@Column({ nullable: true, type: "varchar" })
	tax_registration_doc!: string | null;

	@Column({ nullable: true, type: "varchar" })
	authority_signatory_doc!: string | null;

	// @Column({ nullable: true, type: 'varchar' })
	// description!: string;

	// @Column({ nullable: true, type: 'varchar' })
	// photo!: string;
}
