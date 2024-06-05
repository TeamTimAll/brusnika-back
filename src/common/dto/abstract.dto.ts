import { AbstractEntity } from '../abstract.entity';

// src/dto/abstract.dto.ts
export abstract class BaseDto {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
