import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from "class-validator";
import { ValidationOptions } from "joi";

@ValidatorConstraint({ async: false })
export class IsPrefixConstraint implements ValidatorConstraintInterface {
	validate(value: unknown, args?: ValidationArguments): boolean {
		if (!args?.constraints) {
			return false;
		}
		const constraints = args.constraints as string[];
		if (typeof value !== "string") {
			return false;
		}
		const prefixChecks: boolean[] = [];
		constraints.forEach((c) => prefixChecks.push(value.startsWith(c)));
		return prefixChecks.includes(true);
	}
	defaultMessage?(args?: ValidationArguments): string {
		if (!args?.constraints) {
			return "constraints are required!";
		}
		const constraints = args.constraints as string[];
		return `String must start with the prefix ${constraints.map((e) => `"${e}"`).join(" | ")}`;
	}
}

export function IsPrefixes(
	prefixes: string[],
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: prefixes,
			validator: IsPrefixConstraint,
		});
	};
}
