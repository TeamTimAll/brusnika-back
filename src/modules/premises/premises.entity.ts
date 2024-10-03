import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	VirtualColumn,
} from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BookingsEntity } from "../bookings/bookings.entity";
import { BuildingEntity } from "../buildings/buildings.entity";
import { SectionEntity } from "../sections/sections.entity";

import { PremiseSchemaEntity } from "./premise_schema.entity";
import { SeasonEntity } from "./season.entity";

// prettier-ignore
export enum PremisesType {
	APARTMENT	= "apartment",
	STOREROOM	= "storeroom",
	PARKING		= "parking",
	COMMERCIAL	= "commercial",
}

// prettier-ignore
export enum CommercialStatus {
	FREE	= "free",
	TAKEN	= "taken",
}

// prettier-ignore
export enum PuchaseOptions {
	MORTAGE			= "mortage",
	INSTALLMENT		= "installment",
	BILL			= "bill",
	FULL_PAYMENT	= "full_payment",
}

export enum PremiseFeature {
	SIGN_EXCHANGE_RF = "sign_exchange_rf",
	SIGN_FLOOR_TO_CEILING = "sign_floor_to_ceiling",
	SIGN_WINDOW_IN_THE_CORRIDOR = "sign_window_in_the_corridor",
	SIGN_WINDOW_IN_THE_BATHROOM = "sign_window_in_the_bathroom",
	SIGN_NO_FINISHING = "sign_no_finishing",
	SIGN_TWO_LEVEL = "sign_two_level",
	SIGN_SEPARATE_ENTRANCE = "sign_separate_entrance",
	SIGN_OPEN_PLAN = "sign_open_plan",
	SIGN_BALCONY = "sign_balcony",
	SIGN_SUMMER_KITCHEN_ON_THE_ROOF = "sign_summer_kitchen_on_the_roof",
	SIGN_LOGGIA = "sign_loggia",
	SIGN_TERRACE = "sign_terrace",
	SIGN_ROOF_TERRACE = "sign_roof_terrace",
	SIGN_TERRACE_WITH_ACCESS_TO_THE_ROOF = "sign_terrace_with_access_to_the_roof",
	SIGN_SECOND_BATHROOM = "sign_second_bathroom",
	SIGN_DRESSING_ROOM_IN_THE_BEDROOM = "sign_dressing_room_in_the_bedroom",
	SIGN_DRESSING_ROOM = "sign_dressing_room",
	SIGN_STORAGE_ROOM = "sign_storage_room",
	SIGN_LAUNDRY_ROOM = "sign_laundry_room",
	SIGN_MASTER_BEDROOM = "sign_master_bedroom",
	SIGN_SECONDARY_APARTMENT = "sign_secondary_apartment",
	SIGN_GROUND_PARKING = "sign_ground_parking",
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

	@Column({ nullable: true, type: "bigint" })
	price!: bigint;

	@Column({ nullable: true, type: "float", default: 0 })
	size!: number;

	@Column({ nullable: true })
	status!: CommercialStatus;

	@Column({
		nullable: true,
		type: "enum",
		array: true,
		enum: PuchaseOptions,
		default: [PuchaseOptions.MORTAGE],
	})
	purchase_option!: PuchaseOptions[];

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

	@VirtualColumn({
		query: (alias) =>
			`COALESCE((SELECT TRUE FROM bookings b WHERE b.premise_id = ${alias}.id LIMIT 1), FALSE)`,
	})
	is_booked?: boolean;

	@Column({
		type: "enum",
		enum: PremiseFeature,
		nullable: true,
		array: true,
	})
	feature!: PremiseFeature[];
}
