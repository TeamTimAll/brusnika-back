import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from "class-validator";

export function IsDifferent(
	property: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "isDifferent",
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: unknown, args: ValidationArguments) {
					const constraints = args.constraints as string[];
					const relatedPropertyName = constraints[0];
					const relatedValue = (
						args.object as Record<string, unknown>
					)[relatedPropertyName];
					return value !== relatedValue;
				},
				defaultMessage(args: ValidationArguments) {
					const constraints = args.constraints as string[];
					const relatedPropertyName = constraints[0];
					return `${args.property} and ${relatedPropertyName} should not be the same!`;
				},
			},
		});
	};
}
