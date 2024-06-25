import { DataSource } from 'typeorm';
import { BookingsEntity } from './bookings.entity';
import { BasicService } from '../../generic/service';
import { UpdateBookingsDto } from './dtos/update-bookings.dto';
import { CreateBookingsDto } from './dtos/create-bookings.dto';
import { InjectDataSource } from '@nestjs/typeorm';

export class BookingsService extends BasicService<
  BookingsEntity,
  CreateBookingsDto,
  UpdateBookingsDto
> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super('Bookings', BookingsEntity, dataSource);
  }
}
