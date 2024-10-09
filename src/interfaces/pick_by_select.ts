import { FindOptionsSelect } from "typeorm";

export type PickBySelect<T, K extends FindOptionsSelect<T>> = Pick<
	T,
	Extract<keyof K, keyof T>
>;

/*
Recursion version:

export type PickBySelect<T, K extends FindOptionsSelect<T>> = {
 	[P in Extract<keyof K, keyof T>]: K[P] extends true
 		? T[P]
 		: K[P] extends object
 			? T[P] extends object
 				? PickBySelect<T[P], K[P]>
 				: never
 			: T[P];
};
*/
