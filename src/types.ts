/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
	...arguments_: Arguments
) => T;

export type KeyOfType<Entity, U> = {
	[P in keyof Required<Entity>]: Required<Entity>[P] extends U
		? P
		: Required<Entity>[P] extends U[]
			? P
			: never;
}[keyof Entity];

export type WithOutToDto<T> = Omit<T, "toDto">;

export interface Links {
	self: number;
	next: number | null;
	last: number;
	limit: number;
}

export interface ServiceResponse<T> {
	links: Links;
	data: T;
}
