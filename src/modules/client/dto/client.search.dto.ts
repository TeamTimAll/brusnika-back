import { IsNotEmpty , IsString } from "class-validator"


export class ClientSearchDto {
     @IsNotEmpty()
     @IsString()
      data !: string 

      @IsNotEmpty()
      @IsString()
      identifier !: string
};


