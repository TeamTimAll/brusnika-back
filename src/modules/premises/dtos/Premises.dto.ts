import { ApiProperty } from "@nestjs/swagger";

import { SectionEntity } from "../../sections/sections.entity";
import {
	CommercialStatus,
	PremiseEntity,
	PremiseFeature,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

import { PremiseSchemaDto } from "./CreatePremises.dto";

export class PremiseDto
	implements
		Omit<
			Required<PremiseEntity>,
			"building" | "bookings" | "season" | "schema"
		>
{
	@ApiProperty()
	id!: number;

	@ApiProperty()
	ext_id!: string;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty({ enum: PremisesType })
	type!: PremisesType;

	@ApiProperty()
	building_id!: number;

	@ApiProperty()
	price!: bigint;

	@ApiProperty()
	size!: number;

	@ApiProperty({ enum: CommercialStatus })
	status!: CommercialStatus;

	@ApiProperty({ enum: PuchaseOptions, isArray: true })
	purchase_option!: PuchaseOptions[];

	@ApiProperty()
	number!: number;

	@ApiProperty()
	link!: string;

	@ApiProperty()
	floor!: number;

	@ApiProperty()
	photo!: string;

	@ApiProperty()
	rooms!: number;

	@ApiProperty()
	photos!: string[];

	@ApiProperty()
	similiarApartmentCount!: number;

	@ApiProperty()
	end_date!: Date;

	@ApiProperty()
	mortagePayment!: number;

	@ApiProperty()
	section!: SectionEntity;

	@ApiProperty()
	section_id!: number;

	@ApiProperty()
	is_sold!: boolean;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	season_id!: number;

	@ApiProperty()
	schema_id!: number;

	@ApiProperty()
	is_booked!: boolean;

	@ApiProperty({ type: PremiseSchemaDto })
	schema!: PremiseSchemaDto;

	@ApiProperty({ enum: PremiseFeature, isArray: true })
	feature!: PremiseFeature[];

	@ApiProperty()
	year!: number;

	@ApiProperty()
	quarter!: number;

	@ApiProperty()
	feature_new!: string;
}
