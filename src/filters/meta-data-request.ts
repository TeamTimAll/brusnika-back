import { type Request } from "express";

import { BaseDto } from "../common/base/base_dto";
import { ResponseStatusType } from "../common/enums/response_status_type_enum";

export function requestToMetaData<T>(
	request: Request,
	responceType = ResponseStatusType.ERROR,
): BaseDto<T> {
	let dto = request.body as BaseDto<T>;
	if (dto instanceof BaseDto) {
		dto = request.body as BaseDto<T>;
	} else {
		dto = new BaseDto();
	}
	const metaData = BaseDto.createFromDto(dto);
	metaData.setResponseType(responceType);

	// Setting request query to meta param
	for (const key in request.query) {
		if (Object.prototype.hasOwnProperty.call(request.query, key)) {
			const element = request.query[key];
			metaData.meta.params[key] = element;
		}
	}

	return metaData;
}
