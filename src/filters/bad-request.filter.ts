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
import { InputValidationError } from "../common/errors/inputValidationError";
import { CustomValidationError } from "../common/errors/valitationError";
import { ApplicationPromptID } from "../lib/prompt/applicationPrompt";

import { requestToMetaData } from "./meta-data-request";

@Catch(CustomValidationError)
export class HttpValidationErrorFilter
	implements ExceptionFilter<CustomValidationError>
{
	constructor(public reflector: Reflector) {}

	catch(exception: CustomValidationError, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const dto = requestToMetaData(request);

		dto.meta.prompt = new InputValidationError({
			message: "validation error",
			meta: exception,
		});

		response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(dto);
	}
}

@Catch(BaseError)
export class HttpErrorFilter implements ExceptionFilter<BaseError> {
	catch(exception: BaseError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const dto = requestToMetaData(request);

		dto.setPrompt(exception);

		response.status(exception.status).json(dto);
	}
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus() as HttpStatus;

		const dto = requestToMetaData(request);

		let id = ApplicationPromptID.INTERNAL_SERVER_ERROR;
		if (status === HttpStatus.NOT_FOUND) {
			id = ApplicationPromptID.METHOD_NOT_FOUND_ERROR;
		}

		dto.setPrompt(
			new BaseError(
				id,
				{
					message: exception.message,
					meta: {
						exception: exception.name,
					},
				},
				status,
			),
		);

		response.status(status).json(dto);
	}
}
