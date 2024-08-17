import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { TrainingEntity } from "../trainings.entity";

type ITrainingDto = Omit<
	TrainingEntity,
	"user" | "category" | "views" | "likes"
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
	is_copy_enabled!: boolean;

	@ApiProperty()
	extra_like_icon!: string;

	@ApiProperty()
	published_at!: Date;

	@ApiProperty()
	category_id!: number;

	@ApiProperty()
	user_id?: number;

	@ApiProperty()
	is_show!: boolean;

	@ApiProperty()
	is_active!: boolean;
}

export class TrainingMetaDataDto extends BaseDto<TrainingDto> implements Dto {
	@ApiProperty({ type: TrainingDto })
	declare data: TrainingDto;

	desc = "### Training ma'lumotlari";
}

export class TrainingArrayMetaDataDto extends BaseDto<TrainingDto[]> {
	@ApiProperty({ type: TrainingDto, isArray: true })
	declare data: TrainingDto[];

	desc = "### Training ma'lumotlari";
}
