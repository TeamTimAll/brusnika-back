
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { NEWS_CATEGORIES } from "../news.entity"
import { BaseDto } from '../../../common/dto/abstract.dto';



export class NewsDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  coverImage!: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  category!: NEWS_CATEGORIES;
}
