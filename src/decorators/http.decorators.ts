import {
	Param,
	ParseArrayPipe,
	ParseUUIDPipe,
	Query,
	UseGuards,
	UseInterceptors,
	applyDecorators,
	type PipeTransform,
} from "@nestjs/common";
import { type Type } from "@nestjs/common/interfaces";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ValidationError } from "class-validator";

import { CustomValidationError } from "../common/errors/valitationError";
import { type RoleType } from "../constants";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user-interceptor.service";

import { PublicRoute } from "./public-route.decorator";
import { Roles } from "./roles.decorator";

export function Auth(
	roles: RoleType[] = [],
	options?: Partial<{ public: boolean }>,
): MethodDecorator {
	const isPublicRoute = options?.public;

	return applyDecorators(
		Roles(roles),
		UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
		ApiBearerAuth(),
		UseInterceptors(AuthUserInterceptor),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		PublicRoute(Boolean(isPublicRoute)),
	);
}

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
