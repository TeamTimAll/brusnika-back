import { BaseEntity } from "../base/base.entity";

// src/dto/abstract.dto.ts
export abstract class BaseDto {
	id!: number;
	createdAt!: Date;
	updatedAt!: Date;

	constructor(entity: BaseEntity) {
		this.id = entity.id;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;
	}
}
