import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Uuid } from 'boilerplate.polyfill';
import { BaseDto } from '../../../common/dto/abstract.dto';

export class ProjectSDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  userId!: Uuid;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsNotEmpty()
  @IsDateString()
  end_date!: Date;
}
