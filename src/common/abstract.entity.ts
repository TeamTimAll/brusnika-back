import { SetMetadata } from "@nestjs/common";
import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { BaseDto } from "./dto/abstract.dto";

export type Constructor<T, Args extends unknown[] = unknown[]> = new (
	...args: Args
) => T;

export const DTO_CLASS_KEY = "dtoClass";

export const UseDto = <T>(dtoClass: Constructor<T>): ClassDecorator => {
	return SetMetadata(DTO_CLASS_KEY, dtoClass);
};

export abstract class AbstractEntity<DTO extends BaseDto = BaseDto, O = never> {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn({ type: "timestamp" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updatedAt!: Date;

	// eslint-disable-next-line no-use-before-define
	protected static dtoClass?: Constructor<BaseDto, [AbstractEntity]>;

	static getDtoClass(): Constructor<BaseDto, [AbstractEntity]> {
		if (!this.dtoClass) {
			throw new Error(`DTO class not set for ${this.name}`);
		}
		return this.dtoClass;
	}

	toDto(options?: O): DTO {
		const dtoClass = (
			this.constructor as typeof AbstractEntity
		).getDtoClass() as Constructor<DTO, [AbstractEntity, O?]>;

		return new dtoClass(this, options);
	}
}
