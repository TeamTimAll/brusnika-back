import { NotFoundException } from '@nestjs/common';

export class CitiesNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.CitiesNotFound', error);
  }
}
