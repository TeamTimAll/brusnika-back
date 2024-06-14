import { ApiResponse } from "@nestjs/swagger";

import { BaseError } from "../common/base/baseError";
import { BaseDto } from "../common/base/base_dto";

export function ApiErrorResponse<T extends new (meta?: string) => BaseError>(
	error: T,
	meta?: string,
): MethodDecorator {
	return ApiResponse({
		status: new error().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new error(meta),
			),
		},
	});
}
