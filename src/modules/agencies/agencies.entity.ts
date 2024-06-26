import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { UserEntity } from "../user/user.entity";
import { CitiesEntity } from "../cities/cities.entity";

import { AgenciesDto } from "./dtos/agencies.dto";

@Entity({ name: "agencies" })
@UseDto(AgenciesDto)
export class AgenciesEntity extends AbstractEntity<AgenciesDto> {
	@OneToMany(() => UserEntity, (userEntity) => userEntity.agency, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "userId" })
	user!: UserEntity;

	@Column({ nullable: true, type: "varchar" })
	title!: string;

	@ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CitiesEntity;

	@Column({ nullable: true })
	city_id?: string;

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
