import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, MetaResponseDto } from "../../../common/base/base_dto";
import {
	BookingsEntity as BookingEntity,
	BookingStatus,
	PuchaseOptions,
} from "../bookings.entity";
import { IUserCreation } from "../bookings.service";

type IBookingDto = Omit<
	BookingEntity,
	"premise" | "client" | "agent" | "create_by"
>;

export class UserCreationDto implements IUserCreation {
	@ApiProperty()
	user_created_count!: number;

	@ApiProperty()
	max_user_creation_limit!: number;

	@ApiProperty()
	remaining_user_creation_limit!: number;
}

export class BookingMetaDto extends MetaResponseDto {
	@ApiProperty({ type: UserCreationDto })
	declare data: IUserCreation;
}

export class BookingDto implements IBookingDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	premise_id?: number;

	@ApiProperty()
	client_id?: number;

	@ApiProperty()
	agent_id?: number;

	@ApiProperty()
	date!: Date;

	@ApiProperty()
	time!: string;

	@ApiProperty()
	purchase_option!: PuchaseOptions;

	@ApiProperty({ enum: BookingStatus })
	status!: BookingStatus;

	@ApiProperty()
	create_by_id?: number;
}

export class BookingMetaDataDto extends BaseDto<BookingDto> {
	@ApiProperty({ type: BookingMetaDto })
	declare meta: BookingMetaDto;

	@ApiProperty({ type: BookingDto })
	declare data: BookingDto;

	desc = `### User yasalganda qaytadigan ma'lumotlar.
        \n **data**'da booking entity ma'lumoti.
        \n **meta**'da yasovchi foydalanuvchiga nisbattan qo'shimcha **data** field'da:
        \n - **user_created_count** - yasalgan foydalanuvchilar soni
        \n - **max_user_creation_limit** - foydalanuvchilar yasash limit'i
        \n - **remaining_user_creation_limit** - yasash imkoni soni`;
}
