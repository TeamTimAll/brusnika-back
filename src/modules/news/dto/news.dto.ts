
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { NEWS_CATEGORIES } from "../news.entity.dto"
import { AbstractDto } from 'common/dto/abstract.dto';



export class NewsDto extends AbstractDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  coverImage!: string;

  @IsEnum(NEWS_CATEGORIES)
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  category!: NEWS_CATEGORIES;
}
