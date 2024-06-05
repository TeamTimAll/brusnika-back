import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// src/types/constructor.type.ts
export type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T;


// src/decorators/use-dto.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { BaseDto } from './dto/abstract.dto';

export const DTO_CLASS_KEY = 'dtoClass';

export const UseDto = <T>(dtoClass: Constructor<T>): ClassDecorator => {
  return SetMetadata(DTO_CLASS_KEY, dtoClass);
};

export abstract class AbstractEntity<DTO extends BaseDto = BaseDto, O = never> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;


  protected static dtoClass?: Constructor<BaseDto, [AbstractEntity]>;

  static getDtoClass(): Constructor<BaseDto, [AbstractEntity]> {
    if (!this.dtoClass) {
      throw new Error(`DTO class not set for ${this.name}`);
    }
    return this.dtoClass;
  }

  toDto(options?: O): DTO {
    const dtoClass = (this.constructor as typeof AbstractEntity).getDtoClass() as Constructor<DTO, [AbstractEntity, O?]>;

    return new dtoClass(this, options);
  }
}
