import { ApiProperty } from "@nestjs/swagger";

import { SectionEntity } from "../../sections/sections.entity";
import {
	CommercialStatus,
	PremiseEntity,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

export class PremiseDto
	implements
		Omit<Required<PremiseEntity>, "building" | "bookings" | "season">
{
	@ApiProperty()
	id!: number;

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
	price!: number;

	@ApiProperty()
	size!: number;

	@ApiProperty({ enum: CommercialStatus })
	status!: CommercialStatus;

	@ApiProperty({ enum: PuchaseOptions })
	purchaseOption!: PuchaseOptions;

	@ApiProperty()
	number!: number;

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
	sunrise_angle!: number;

	@ApiProperty()
	schema_image!: string;

	@ApiProperty()
	season_id!: number;
}
