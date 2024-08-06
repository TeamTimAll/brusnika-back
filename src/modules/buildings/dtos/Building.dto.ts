import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

import { PremiseDto } from "../../premises/dtos/Premises.dto";
import { PremiseEntity } from "../../premises/premises.entity";
import { ProjectEntity } from "../../projects/project.entity";
import { SectionsEntity } from "../../sections/sections.entity";
import { BuildingEntity } from "../buildings.entity";

export class BuildingDto implements BuildingEntity {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	total_storage!: number;

	@ApiProperty()
	total_vacant_storage!: number;

	@ApiProperty()
	total_parking_space!: number;

	@ApiProperty()
	total_vacant_parking_space!: number;

	@ApiProperty()
	total_commercial!: number;

	@ApiProperty()
	total_vacant_commercial!: number;

	@ApiProperty()
	address!: string;

	@ApiProperty()
	number_of_floors!: number;

	@ApiProperty()
	total_apartment!: number;

	@ApiProperty()
	total_vacant_apartment!: number;

	@ApiProperty()
	photos?: string[];

	@ApiProperty()
	project!: ProjectEntity;

	@ApiProperty()
	project_id!: number;

	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(PremiseDto) }],
		type: () => PremiseDto,
	})
	premises?: PremiseEntity[];

	@ApiProperty()
	sections?: SectionsEntity[];
}
