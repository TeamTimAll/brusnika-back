import { Uuid } from 'boilerplate.polyfill';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  userId!: Uuid;

  @IsString()
  @IsNotEmpty()
  eventId!: Uuid;

  @IsString()
  @IsNotEmpty()
  comment: string;



  constructor(){
      this.comment =""
  }
  
}
