import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class ProjectSDto extends AbstractDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  detailedDescription!: string;

  @IsString()
  @IsNotEmpty()
  briefDescription!: string;

  @IsString()
  @IsNotEmpty()
  photo!: string;

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
