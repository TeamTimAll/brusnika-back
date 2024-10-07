import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { BuildingEntity } from "../../buildings/buildings.entity";
import { ClientEntity } from "../../client/client.entity";
import { PremiseEntity } from "../../premises/premises.entity";
import { MortgageRequestEntity } from "../mortgage-request.entity";

type IMortgageRequestDto = Omit<MortgageRequestEntity, "ext_id">;

export class MortgageRequestDto implements IMortgageRequestDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	client_id!: number;

	@ApiProperty()
	first_payment!: number;

	@ApiProperty()
	cost!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty({ type: ClientEntity })
	building!: BuildingEntity;

	@ApiProperty()
	building_id!: number;

	@ApiProperty({ type: ClientEntity })
	premise!: PremiseEntity;

	@ApiProperty()
	premise_id!: number;

	@ApiProperty()
	comment!: string;
}

export class MortgageRequestMetaDataDto
	extends BaseDto<MortgageRequestDto>
	implements Dto
{
	@ApiProperty({ type: MortgageRequestDto })
	declare data: MortgageRequestDto;

	desc = "### Mortgage Request ma'lumotlari";
}

export class MortgageRequestArrayMetaDataDto extends BaseDto<
	MortgageRequestDto[]
> {
	@ApiProperty({ type: MortgageRequestDto, isArray: true })
	declare data: MortgageRequestDto[];

	desc = "### Mortgage Request ma'lumotlari";
}
