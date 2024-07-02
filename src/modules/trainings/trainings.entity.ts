import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";

import { TrainingsDto } from "./dto/trainings.dto";
import { TrainingsCategories } from "./modules/categories/categories.entity";
import { TrainingsLikes } from "./modules/likes/likes.entity";
import { TrainingsViews } from "./modules/views/views.entity";

@Entity({ name: "trainings" })
@UseDto(TrainingsDto)
export class TrainingsEntity extends AbstractEntity<TrainingsDto> {
	@Column({ nullable: true, type: "varchar" })
	title!: string;

	@Column({ nullable: true, type: "text" })
	content!: string;

	@Column({ nullable: true, type: "varchar" })
	cover_image!: string;

	@Column({ type: "boolean", default: false })
	is_like_enabled!: boolean;

	@Column({ type: "boolean", default: false })
	is_extra_like_enabled!: boolean;

	@Column({ type: "text", nullable: true })
	extra_like_icon!: string;

	@Column({
		type: "timestamp without time zone",
		nullable: true,
		default: () => "CURRENT_TIMESTAMP",
	})
	published_at!: Date;

	@Column({ type: "uuid", nullable: true })
	primary_category_id!: string;

	@OneToOne(() => TrainingsCategories)
	@JoinColumn({ name: "primary_category_id" })
	primary_category?: TrainingsCategories;

	@Column({ type: "uuid", nullable: true })
	second_category_id?: string;

	@OneToOne(() => TrainingsCategories)
	@JoinColumn({ name: "second_category_id" })
	secondary_category!: TrainingsCategories;

	@OneToMany(
		() => TrainingsViews,
		(TrainingsViews) => TrainingsViews.trainings,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	views?: TrainingsViews[];

	@OneToMany(
		() => TrainingsLikes,
		(TrainingsLikes) => TrainingsLikes.trainings,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	likes?: TrainingsLikes[];

	static toDto(
		entity: Partial<WithOutToDto<TrainingsEntity>>,
	): WithOutToDto<TrainingsEntity> {
		const dto: WithOutToDto<TrainingsEntity> = {
			id: entity.id ?? "",
			title: entity.title ?? "",
			content: entity.content ?? "",
			cover_image: entity.cover_image ?? "",
			is_like_enabled: entity.is_like_enabled ?? false,
			is_extra_like_enabled: entity.is_extra_like_enabled ?? false,
			extra_like_icon: entity.extra_like_icon ?? "",
			published_at: entity.published_at ?? new Date(),
			primary_category_id: entity.primary_category_id ?? "",
			second_category_id: entity.second_category_id ?? "",
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
			primary_category:
				entity.primary_category ?? new TrainingsCategories(),
			secondary_category:
				entity.secondary_category ?? new TrainingsCategories(),
		};
		return dto;
	}
}
