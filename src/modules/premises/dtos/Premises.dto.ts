import { ApiProperty } from "@nestjs/swagger";

import { SectionEntity } from "../../sections/sections.entity";
import {
	CommercialStatus,
	PremiseEntity,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

export class PremiseDto
	implements Omit<PremiseEntity, "building" | "bookings">
{
	@ApiProperty()
	id!: number;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty({ enum: PremisesType })
	type!: PremisesType;

	@ApiProperty()
	building_id?: number;

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
	section_id?: number;

	@ApiProperty()
	is_sold!: boolean;
}
