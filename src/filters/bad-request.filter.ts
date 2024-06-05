import {
	Catch,
	HttpException,
	HttpStatus,
	type ArgumentsHost,
	type ExceptionFilter,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { type Request, type Response } from "express";

import { BaseError } from "../common/base/baseError";
import { BaseDto } from "../common/base/base_dto";
import { ResponseStatusType } from "../common/enums/response_status_type_enum";
import { InputValidationError } from "../common/errors/inputValidationError";
import { CustomValidationError } from "../common/errors/valitationError";
import { ApplicationPromptID } from "../lib/prompt/applicationPrompt";

@Catch(CustomValidationError)
export class HttpValidationErrorFilter
	implements ExceptionFilter<CustomValidationError>
{
	constructor(public reflector: Reflector) {}

	catch(exception: CustomValidationError, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let dto = request.body as BaseDto;
		if (!dto) {
			dto = new BaseDto();
		}
		const metaData = BaseDto.createFromDto(dto);
		dto.meta.type = ResponseStatusType.ERROR;
		dto.meta.prompt = new InputValidationError({
			message: "validation error",
			meta: exception,
		});

		response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(metaData);
	}
}

@Catch(BaseError)
export class HttpErrorFilter implements ExceptionFilter<BaseError> {
	catch(exception: BaseError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let dto = request.body as BaseDto;
		if (!dto) {
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
		metaData.meta.prompt = exception;
		response.status(exception.status).json(metaData);
	}
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		let dto = request.body as BaseDto;
		if (!dto) {
			dto = new BaseDto();
		}
		const metaData = BaseDto.createFromDto(dto);
		dto.meta.type = ResponseStatusType.ERROR;

		let id = ApplicationPromptID.INTERNAL_SERVER_ERROR;
		if (status === HttpStatus.NOT_FOUND) {
			id = ApplicationPromptID.METHOD_NOT_FOUND_ERROR;
		}
		metaData.meta.prompt = new BaseError(
			id,
			{
				message: exception.message,
				meta: {
					exception: exception.name,
				},
			},
			status,
		);

		response.status(status).json(metaData);
	}
}
