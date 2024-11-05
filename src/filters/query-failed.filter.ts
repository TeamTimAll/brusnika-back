import {
	Catch,
	HttpStatus,
	type ArgumentsHost,
	type ExceptionFilter,
} from "@nestjs/common";
import { type Request, type Response } from "express";
import { DatabaseError } from "pg";
import {
	CannotCreateEntityIdMapError,
	EntityMetadataNotFoundError,
	EntityNotFoundError,
	QueryFailedError,
} from "typeorm";

import { BaseError } from "../common/base/baseError";
import { ApplicationPromptID } from "../lib/prompt/applicationPrompt";
import { PromptType } from "../lib/prompt/prompt";

import { requestToMetaData } from "./meta-data-request";

@Catch(QueryFailedError)
export class QueryFailedErrorFilter
	implements ExceptionFilter<QueryFailedError>
{
	catch(exception: QueryFailedError<DatabaseError>, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const dto = requestToMetaData(request);

		const prompt = new BaseError(
			0,
			{ message: exception.driverError.constraint ?? "database error" },
			HttpStatus.INTERNAL_SERVER_ERROR,
			PromptType.POSTGRES,
			exception.driverError.code,
		);
		dto.setPrompt(prompt);
		response.status(prompt.status).json(dto);
	}
}

@Catch(
	EntityNotFoundError,
	EntityMetadataNotFoundError,
	CannotCreateEntityIdMapError,
)
export class TypeORMErrorFilter
	implements
		ExceptionFilter<
			| EntityNotFoundError
			| EntityMetadataNotFoundError
			| CannotCreateEntityIdMapError
		>
{
	catch(
		_exception:
			| EntityNotFoundError
			| EntityMetadataNotFoundError
			| CannotCreateEntityIdMapError,
		host: ArgumentsHost,
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const dto = requestToMetaData(request);

		const prompt = new BaseError(
			ApplicationPromptID.INTERNAL_SERVER_ERROR,
			{ message: "database error" },
			HttpStatus.INTERNAL_SERVER_ERROR,
			PromptType.APPLICATION,
		);

		dto.setPrompt(prompt);

		response.status(prompt.status).json(dto);
	}
}
