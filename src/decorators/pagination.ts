import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export function Page() {
	return applyDecorators(
		ApiProperty({ required: false }),
		Transform(({ value }) => parseInt(value as string)),
		IsNumber(),
		IsOptional(),
		Min(1),
	);
}

export function Limit() {
	return applyDecorators(
		ApiProperty({ required: false }),
		Transform(({ value }) => parseInt(value as string)),
		IsNumber(),
		IsOptional(),
		Max(100),
		Min(1),
	);
}
