import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { BaseDto } from "common/dto/abstract.dto";
import { Constructor } from "types";

export const DTO_CLASS_KEY = "dtoClass";

export const UseDto = <T extends BaseDto>(dtoClass: Constructor<T>): ClassDecorator => {
  return (target: unknown) => {
    SetMetadata(DTO_CLASS_KEY, dtoClass)(target as CustomDecorator);
    (target as Record<"dtoClass", Constructor<T>>).dtoClass = dtoClass;
  };
};
