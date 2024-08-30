import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BookingsEntity } from "../bookings/bookings.entity";
import { BuildingEntity } from "../buildings/buildings.entity";
import { SectionEntity } from "../sections/sections.entity";

import { PremiseSchemaEntity } from "./premise_schema.entity";
import { SeasonEntity } from "./season.entity";

export enum PremisesType {
	APARTMENT = "apartment",
	STOREROOM = "storeroom",
	PARKING = "parking",
	COMMERCIAL = "commercial",
}

export enum CommercialStatus {
	FREE = "free",
	TAKEN = "taken",
}

export enum PuchaseOptions {
	MORTAGE = "mortage",
	INSTALLMENT = "installment",
	BILL = "bill",
	FULL_PAYMENT = "full_payment",
}

@Entity({ name: "premises" })
export class PremiseEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	name!: string;

	@Column({ nullable: false, type: "enum", enum: PremisesType })
	type!: PremisesType;

	@ManyToOne(
		() => BuildingEntity,
		(BuildingsEntity) => BuildingsEntity.premises,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "building_id" })
	building!: BuildingEntity;

	@Column({ type: "integer", nullable: true })
	building_id?: number;

	@Column({ nullable: true, type: "varchar" })
	price!: number;

	@Column({ nullable: true, type: "varchar" })
	size!: number;

	@Column({ nullable: true })
	status!: CommercialStatus;

	@Column({ nullable: true, type: "varchar" })
	purchaseOption!: PuchaseOptions;

	@Column({ nullable: true, type: "varchar" })
	number!: number;

	@Column({ nullable: true })
	floor!: number;

	@Column({ nullable: true })
	photo!: string;

	@Column({ nullable: true })
	rooms!: number;

	@Column({ type: "text", array: true, nullable: true })
	photos: string[] = [];

	@Column({ nullable: true })
	similiarApartmentCount!: number;

	@OneToOne(() => PremiseSchemaEntity, (s) => s.premise, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "schema_id" })
	schema!: PremiseSchemaEntity;

	@Column({ type: "integer", nullable: true })
	schema_id?: number;

	@Column({ nullable: true, type: "varchar" })
	link?: string;

	@ManyToOne(() => SeasonEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "season_id" })
	season!: SeasonEntity;

	@Column({ type: "integer", nullable: true })
	season_id?: number;

	@Column({ nullable: true })
	mortagePayment!: number;

	@ManyToOne(
		() => SectionEntity,
		(SectionsEntity) => SectionsEntity.premises,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "section_id" })
	section!: SectionEntity;

	@Column({ type: "integer", nullable: true })
	section_id?: number;

	@Column({ nullable: true, type: "boolean", default: false })
	is_sold!: boolean;

	@OneToMany(() => BookingsEntity, (Bookings) => Bookings.premise, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	bookings?: BookingsEntity[];
}
