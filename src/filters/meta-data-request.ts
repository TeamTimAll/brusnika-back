import { type Request } from "express";

import { BaseDto } from "../common/base/base_dto";
import { ResponseStatusType } from "../common/enums/response_status_type_enum";

export function requestToMetaData(request: Request): BaseDto {
	let dto = request.body as BaseDto;
	if (dto instanceof BaseDto) {
		dto = request.body as BaseDto;
	} else {
		dto = new BaseDto();
	}
	const metaData = BaseDto.createFromDto(dto);
	metaData.setResponseType(ResponseStatusType.ERROR);

	// Setting request query to meta param
	for (const key in request.query) {
		if (Object.prototype.hasOwnProperty.call(request.query, key)) {
			const element = request.query[key];
			metaData.meta.params[key] = element;
		}
	}

	return metaData;
}
