import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ParkingSpaceStatus  } from "../carParking.entity";

export class CarParkingDto {

    @IsNotEmpty()
    @IsString()
    buildingId !: string

    @IsNotEmpty()
    @IsNumber()
    floor !: string

    @IsNotEmpty()
    @IsString()
    parkingPlaceNumber !: string

    @IsNotEmpty()
    @IsString()
    price !: string

    @IsNotEmpty()
    @IsString()
    size !: string

    @IsNotEmpty()
    status!: ParkingSpaceStatus;

    @IsNotEmpty()
    @IsString()
    photo !: string
    
}