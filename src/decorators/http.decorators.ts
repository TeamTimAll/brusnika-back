import {
	Param,
	ParseArrayPipe,
	ParseUUIDPipe,
	Query,
	type PipeTransform,
} from "@nestjs/common";
import { type Type } from "@nestjs/common/interfaces";
import { ValidationError } from "class-validator";

import { CustomValidationError } from "../common/errors/valitationError";

export function UUIDParam(
	property: string,
	isOptinal = false,
	...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
	return Param(
		property,
		new ParseUUIDPipe({
			optional: isOptinal,
			version: "4",
			exceptionFactory(error_string) {
				const error = new ValidationError();
				error.property = property;
				error.target = { ParseUUIDPipe: error_string };
				error.constraints = { ParseUUIDPipe: error_string };
				return new CustomValidationError([error]);
			},
		}),
		...pipes,
	);
}

export function UUIDQuery(
	property: string,
	isOptinal = false,
	...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
	return Query(
		property,
		new ParseUUIDPipe({
			optional: isOptinal,
			version: "4",
			exceptionFactory(error_string) {
				const error = new ValidationError();
				error.property = property;
				error.target = { ParseUUIDPipe: error_string };
				error.constraints = { ParseUUIDPipe: error_string };
				return new CustomValidationError([error]);
			},
		}),
		...pipes,
	);
}

export function UUIDArrayQuery(
	property: string,
	isOptinal = false,
	...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
	return Query(
		property,
		new ParseArrayPipe({ optional: isOptinal }),
		new ParseUUIDPipe({
			optional: isOptinal,
			version: "4",
			exceptionFactory(error_string) {
				const error = new ValidationError();
				error.property = property;
				error.target = { ParseUUIDPipe: error_string };
				error.constraints = { ParseUUIDPipe: error_string };
				return new CustomValidationError([error]);
			},
		}),
		...pipes,
	);
}
