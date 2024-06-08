import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { BuildingsEntity } from "../buildings/buildings.entity";
import { SectionsEntity } from "../sections/sections.entity";

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

@Entity({ name: "premises" })
export class PremisesEntity extends AbstractEntity {
	@Column({ nullable: true, type: "varchar" })
	name!: string;

	@Column({ nullable: false, type: "enum", enum: PremisesType })
	type!: PremisesType;

	@ManyToOne(
		() => BuildingsEntity,
		(BuildingsEntity) => BuildingsEntity.premises,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "building_id" })
	building!: BuildingsEntity;

	@Column({ nullable: true })
	building_id?: string;

	@Column({ nullable: true, type: "varchar" })
	price!: number;

	@Column({ nullable: true, type: "varchar" })
	size!: number;

	@Column({ nullable: true })
	status!: CommercialStatus;

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

	@Column({ nullable: true })
	title!: string;

	@Column({ nullable: true, type: "date" })
	end_date!: Date;

	@Column({ nullable: true })
	mortagePayment!: number;

	@ManyToOne(
		() => SectionsEntity,
		(SectionsEntity) => SectionsEntity.premises,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "section_id" })
	section!: SectionsEntity;

	@Column({ nullable: true })
	section_id?: string;
}
