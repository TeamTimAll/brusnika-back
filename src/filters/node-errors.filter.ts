import { AssertionError } from "assert";

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from "@nestjs/common";
import { type Request, type Response } from "express";

import { BaseError } from "../common/base/baseError";
import { BaseDto } from "../common/base/base_dto";
import { ResponseStatusType } from "../common/enums/response_status_type_enum";
import { ApplicationPromptID } from "../lib/prompt/applicationPrompt";

/**
 * NodeJS buildin error handler
 */
@Catch(AssertionError, RangeError, ReferenceError, SyntaxError, TypeError)
export class NodeErrorFilter implements ExceptionFilter {
	catch(exception: NodeErrorFilter, host: ArgumentsHost) {
		console.log(exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let dto = request.body as BaseDto;
		if (dto instanceof BaseDto) {
			dto = request.body as BaseDto;
		} else {
			dto = new BaseDto();
		}
		const metaData = BaseDto.createFromDto(dto);
		dto.meta.type = ResponseStatusType.ERROR;

		// Setting request query to meta param
		for (const key in request.query) {
			if (Object.prototype.hasOwnProperty.call(request.query, key)) {
				const element = request.query[key];
				metaData.meta.params[key] = element;
			}
		}

		const prompt = new BaseError(
			ApplicationPromptID.INTERNAL_SERVER_ERROR,
			{ message: "" },
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
		metaData.meta.prompt = prompt;
		response.status(prompt.status).json(metaData);
	}
}
