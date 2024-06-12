import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class EventFinishedToCreatedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.EVENT_FINISHED_TO_CREATED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}

export class EventFinishedToFillDataError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.EVENT_FINISHED_TO_CREATED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
// export class EventCreateToFinishedError extends BaseError {
// 	constructor(message?: string) {
// 		super(
// 			ApplicationPromptID.EVENT_CREATE_TO_FINISHED_ERROR,
// 			{
// 				message: message ?? "",
// 			},
// 			HttpStatus.CONFLICT,
// 		);
// 	}
// }
