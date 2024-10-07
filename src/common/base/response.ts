import { BaseError } from "./baseError";

export class Response<T> {
	constructor(
		public data: T,
		public error?: BaseError | null,
	) {}
}

export class OkResponse<T> extends Response<T> {
	constructor(public data: T) {
		super(data, null);
	}
}
export class ErrorResponse extends Response<unknown> {
	constructor(public error: BaseError) {
		super(null, error);
	}
}
