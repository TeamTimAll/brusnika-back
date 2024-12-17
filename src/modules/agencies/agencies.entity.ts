import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { CityEntity } from "../cities/cities.entity";
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
	title!: string | null;

	@ManyToOne(() => CityEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city!: CityEntity;

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
	contactPersonPhone!: string | null;

	@Column({ nullable: true, type: "varchar" })
	contactPersonName!: string | null;

	@Column({ nullable: true, type: "varchar" })
	contactPersonPosition!: string | null;

	@Column({ nullable: true, type: "varchar" })
	organizationalLegalForm!: string | null;

	@Column({ nullable: true, type: "varchar" })
	entry_doc!: string | null;

	@Column({ nullable: true, type: "varchar" })
	company_card_doc!: string | null;

	@Column({ nullable: true, type: "varchar" })
	tax_registration_doc!: string | null;

	@Column({ nullable: true, type: "varchar" })
	authority_signatory_doc!: string | null;

	@ManyToOne(() => UserEntity, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "create_by_id" })
	create_by!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	create_by_id?: number;

	@Column({ type: "text", nullable: true })
	registrationAgencyDate?: string;

	@Column({ type: "boolean", nullable: true })
	vatAvailability?: boolean;

	@Column({ type: "int", nullable: true })
	termCount?: number;

	@Column({ type: "int", nullable: true })
	employees?: number;

	@Column({ type: "text", nullable: true })
	termUnit?: string;

	@Column({ type: "text", nullable: true })
	okved?: string;

	@Column({ type: "text", nullable: true })
	site?: string;

	@Column({ type: "text", nullable: true })
	amountDealsMonth?: string;

	@Column({ type: "simple-array", nullable: true })
	citiesWork?: string[];

	@Column({ type: "text", nullable: true })
	reasonAgreements?: string;

	@Column({ type: "simple-array", nullable: true })
	agreementsAnotherDeveloper?: string[];

	@Column({ type: "simple-array", nullable: true })
	associations?: string[];

	@Column({ type: "text", nullable: true })
	signer?: string;

	@Column({ type: "text", nullable: true })
	basisForSigning?: string;

	// @Column({ nullable: true, type: 'varchar' })
	// description!: string;

	// @Column({ nullable: true, type: 'varchar' })
	// photo!: string;
}
