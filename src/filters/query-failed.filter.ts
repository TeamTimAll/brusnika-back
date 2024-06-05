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
import { BaseDto } from "../common/base/base_dto";
import { ResponseStatusType } from "../common/enums/response_status_type_enum";
import { ApplicationPromptID } from "../lib/prompt/applicationPrompt";
import { PromptType } from "../lib/prompt/prompt";

@Catch(QueryFailedError)
export class QueryFailedErrorFilter
	implements ExceptionFilter<QueryFailedError>
{
	catch(exception: QueryFailedError<DatabaseError>, host: ArgumentsHost) {
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

		const prompt = new BaseError(
			0,
			{ message: exception.driverError.constraint ?? "database error" },
			HttpStatus.INTERNAL_SERVER_ERROR,
			PromptType.POSTGRES,
			exception.driverError.code,
		);
		metaData.meta.prompt = prompt;
		response.status(prompt.status).json(metaData);
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

		const prompt = new BaseError(
			ApplicationPromptID.INTERNAL_SERVER_ERROR,
			{ message: "database error" },
			HttpStatus.INTERNAL_SERVER_ERROR,
			PromptType.APPLICATION,
		);
		metaData.meta.prompt = prompt;
		response.status(prompt.status).json(metaData);
	}
}
