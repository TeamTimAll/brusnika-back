import { ApiProperty, PickType } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { AgencyDto } from "../../agencies/dtos/Agencies.dto";
import { CityDto } from "../../cities/dtos/City.dto";

import { UserDto } from "./User.dto";

class UserReadAllCityDto extends PickType(CityDto, ["id", "name"]) {}
class UserReadAllAgencyDto extends PickType(AgencyDto, ["id", "legalName"]) {}

export class UserReadAllDto extends UserDto {
	@ApiProperty({ type: UserReadAllCityDto })
	city!: UserReadAllCityDto;

	@ApiProperty({ type: UserReadAllAgencyDto })
	agency!: UserReadAllAgencyDto;
}

export class UserReadAllMetaDataDto
	extends BaseDto<UserReadAllDto>
	implements Dto
{
	@ApiProperty({ type: UserReadAllDto })
	declare data: UserReadAllDto;

	desc = `### User ma'lumotlari
	\n **data**'da user entity ma'lumotlari
    \n **Relation**'lar:
	\n - city entity
	\n - agency entity`;
}
