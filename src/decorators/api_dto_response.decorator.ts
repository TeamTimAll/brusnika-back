import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { Dto } from "../common/base/base_dto";

export function ApiDtoResponse<T extends new () => Dto>(
	dto: T,
	status: HttpStatus,
): MethodDecorator {
	return ApiResponse({
		type: dto,
		description: new dto().desc,
		status: status,
	});
}
