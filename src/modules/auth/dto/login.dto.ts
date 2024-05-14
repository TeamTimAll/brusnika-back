import { IsNotEmpty, IsString  , IsEmail , IsStrongPassword} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;


  constructor(){
      this.email = ""
      this.password = ""
  }

  
}