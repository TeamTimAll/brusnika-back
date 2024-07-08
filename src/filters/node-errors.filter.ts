import { AssertionError } from "assert";

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from "@nestjs/common";
import { type Request, type Response } from "express";

import { BaseError } from "../common/base/baseError";
import { ApplicationPromptID } from "../lib/prompt/applicationPrompt";

import { requestToMetaData } from "./meta-data-request";

/**
 * NodeJS buildin error handler
 */
@Catch(AssertionError, RangeError, ReferenceError, SyntaxError, TypeError)
export class NodeErrorFilter implements ExceptionFilter {
	catch(exception: NodeErrorFilter, host: ArgumentsHost) {
		console.error(exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const dto = requestToMetaData(request);

		const prompt = new BaseError(
			ApplicationPromptID.INTERNAL_SERVER_ERROR,
			{ message: "" },
			HttpStatus.INTERNAL_SERVER_ERROR,
		);

		dto.setPrompt(prompt);

		response.status(prompt.status).json(dto);
	}
}
