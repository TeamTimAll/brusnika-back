import { ApiProperty } from "@nestjs/swagger";

import { CityEntity } from "../cities.entity";

type ICityDto = Omit<CityEntity, "users">;

export class CityDto implements ICityDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	long!: string;

	@ApiProperty()
	lat!: string;
}
