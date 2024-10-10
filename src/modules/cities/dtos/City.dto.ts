import { ApiProperty } from "@nestjs/swagger";

import { BannerDto } from "../../banner/dto/Banner.dto";
import { CityEntity } from "../cities.entity";

type ICityDto = Omit<CityEntity, "ext_id" | "users" | "banner">;

export class CityDto implements ICityDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	long!: string;

	@ApiProperty()
	lat!: string;

	@ApiProperty()
	is_active!: boolean;
}
export class CityWitBannerDto extends CityDto {
	@ApiProperty({ type: BannerDto, isArray: true })
	banner!: BannerDto[];
}
