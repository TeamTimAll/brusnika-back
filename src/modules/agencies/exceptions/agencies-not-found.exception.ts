import { NotFoundException } from '@nestjs/common';

export class AgenciesNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.AgenciesNotFound', error);
  }
}
