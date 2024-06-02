import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Name',
    required: true,
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Something deatiled about the project',
    required: true,
  })
  detailedDescription!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Brief description about the project',
    required: true,
  })
  briefDescription!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: Number,
  })
  price!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Brief description about the project',
    required: true,
  })
  location!: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2022-03-07',
    required: true,
  })
  end_date!: Date;

  @IsString()
  @ApiProperty({
    required: true,
  })
  photo!: string;
}
