import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { type Constructor } from '../types';
import {
  type AbstractDto,
} from './dto/abstract.dto';
import { Uuid } from 'boilerplate.polyfill';



export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })

  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt!: Date;

  // translations?: AbstractTranslationEntity[];

  private dtoClass?: Constructor<DTO, [AbstractEntity, O?]>;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}

// export class AbstractTranslationEntity<
//   DTO extends AbstractTranslationDto = AbstractTranslationDto,
//   O = never,
// > extends AbstractEntity<DTO, O> {
//   @Column({ type: 'enum', enum: LanguageCode })
//   languageCode!: LanguageCode;
// };




