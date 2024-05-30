import { SetMetadata } from '@nestjs/common';
import { AbstractDto } from 'common/dto/abstract.dto';
import { Constructor } from 'types';

export const DTO_CLASS_KEY = 'dtoClass';

export const UseDto = <T extends AbstractDto>(dtoClass: Constructor<T>): ClassDecorator => {
  return (target: any) => {
    SetMetadata(DTO_CLASS_KEY, dtoClass)(target);
    target.dtoClass = dtoClass;
  };
};
