import {  IsOptional , IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { NEWS_CATEGORIES } from "../news.entity.dto"
import { Uuid } from 'boilerplate.polyfill';



export class UpdateNewsDto {

    id  !: Uuid
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    content?: string;
  
    @IsString()
    @IsOptional()
    coverImage?: string;
  
    @IsOptional()
    @Transform(({ value }) => value.toUpperCase())
    category?: NEWS_CATEGORIES;
  }


