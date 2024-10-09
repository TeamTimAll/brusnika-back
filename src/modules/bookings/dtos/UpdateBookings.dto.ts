import { PartialType } from "@nestjs/swagger";

import {
	CreateBookingsDto,
	CreateBookingsMetaDataDto,
} from "./CreateBookings.dto";

export class UpdateBookingsDto extends PartialType(CreateBookingsDto) {}

export class UpdateBookingsMetaDataDto extends CreateBookingsMetaDataDto {}
