import { ApiProperty } from "@nestjs/swagger";

import { ClientEntity } from "../../client/client.entity";
import { BaseDto, Dto } from "../../../common/base/base_dto";
import { UserEntity } from "../../user/user.entity";
import { CallRequestEntity } from "../call-request.entity";
import { PremiseEntity } from "../../premises/premises.entity";

type ICallRequestDto = CallRequestEntity;

export class CallRequestDto implements ICallRequestDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	client_id!: number;

	@ApiProperty({ type: UserEntity })
	agent!: UserEntity;

	@ApiProperty()
	agent_id!: number;

	@ApiProperty({ type: PremiseEntity })
	premise!: PremiseEntity;

	@ApiProperty()
	premise_id!: number;

	@ApiProperty()
	phone!: string;
}

export class CallRequestMetaDataDto
	extends BaseDto<CallRequestDto>
	implements Dto
{
	@ApiProperty({ type: CallRequestDto })
	declare data: CallRequestDto;

	desc = "### Call Request ma'lumotlari";
}

export class CallRequestArrayMetaDataDto extends BaseDto<CallRequestDto[]> {
	@ApiProperty({ type: CallRequestDto, isArray: true })
	declare data: CallRequestDto[];

	desc = "### Call Request ma'lumotlari";
}
