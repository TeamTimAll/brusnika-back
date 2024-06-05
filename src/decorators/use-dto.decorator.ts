import { SetMetadata } from '@nestjs/common';
import { BaseDto } from 'common/dto/abstract.dto';
import { Constructor } from 'types';

export const DTO_CLASS_KEY = 'dtoClass';

export const UseDto = <T extends BaseDto>(dtoClass: Constructor<T>): ClassDecorator => {
  return (target: any) => {
    SetMetadata(DTO_CLASS_KEY, dtoClass)(target);
    target.dtoClass = dtoClass;
  };
};
