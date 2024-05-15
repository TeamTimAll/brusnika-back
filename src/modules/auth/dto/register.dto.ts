// register.dto.ts
import { IsNotEmpty, IsString, MinLength  , IsEmail, IsBoolean} from 'class-validator';

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email : string 
  

    @IsNotEmpty()
    @IsBoolean()
    isActive : boolean
  
    constructor() {
      this.username = "";
      this.password = "";
      this.email =" "
      this.isActive = false 
    }
  }
  
  

