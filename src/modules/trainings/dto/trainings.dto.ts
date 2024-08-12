import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { TrainingEntity } from "../trainings.entity";

type ITrainingDto = Omit<
	TrainingEntity,
	"user" | "secondary_category" | "primary_category" | "views" | "likes"
>;

export class TrainingDto implements ITrainingDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	content!: string;

	@ApiProperty()
	cover_image!: string;

	@ApiProperty()
	is_like_enabled!: boolean;

	@ApiProperty()
	is_extra_like_enabled!: boolean;

	@ApiProperty()
	extra_like_icon!: string;

	@ApiProperty()
	published_at!: Date;

	@ApiProperty()
	primary_category_id!: number;

	@ApiProperty()
	second_category_id?: number;

	@ApiProperty()
	user_id?: number;
}

export class TrainingMetaDataDto extends BaseDto<TrainingDto> implements Dto {
	@ApiProperty({ type: TrainingDto })
	declare data: TrainingDto;

	desc = `### Training ma'lumotlari
	\n **data**'da training entity ma'lumotlari:
	\n - **title** - sarlavhasi
	\n - **content** - mazmuni
	\n - **cover_image** - qoplama rasmi
	\n - **is_like_enabled** - like qo'yib bo'ladimi yoki yo'qmi. True bo'lsa qilish mumkin va False aksi.
	\n - **is_extra_like_enabled** - ---
	\n - **extra_like_icon** - ---
	\n - **published_at** - chop etilgan vaqti
	\n - **primary_category_id** - birinchi kategoriyasi
	\n - **second_category_id** - ikkinchi kategoriyasi
	\n - **user_id** - foydalanuvchi id'si`;
}

export class TrainingArrayMetaDataDto extends BaseDto<TrainingDto[]> {
	@ApiProperty({ type: TrainingDto, isArray: true })
	declare data: TrainingDto[];

	desc = `### Training ma'lumotlari
	\n **data**'da training entity ma'lumotlari:
	\n - **title** - sarlavhasi
	\n - **content** - mazmuni
	\n - **cover_image** - qoplama rasmi
	\n - **is_like_enabled** - like qo'yib bo'ladimi yoki yo'qmi. True bo'lsa qilish mumkin va False aksi.
	\n - **is_extra_like_enabled** - ---
	\n - **extra_like_icon** - ---
	\n - **published_at** - chop etilgan vaqti
	\n - **primary_category_id** - birinchi kategoriyasi
	\n - **second_category_id** - ikkinchi kategoriyasi
	\n - **user_id** - foydalanuvchi id'si`;
}
