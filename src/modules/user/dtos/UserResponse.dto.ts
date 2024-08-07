import { OmitType } from "@nestjs/swagger";

import { Dto } from "../../../common/base/base_dto";
import { AuthResponeWithData } from "../../auth/dtos/AuthResponeWithToken.dto";

export class UserResponseDto extends OmitType(AuthResponeWithData, [
	"register_status",
]) {}

export class UserResponseMetaDataDto implements Dto {
	desc = "string";
}
