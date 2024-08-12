import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";

import { TrainingCategoryEntity } from "./entities/categories.entity";
import { TrainingLikeEntity } from "./entities/likes.entity";
import { TrainingViewEntity } from "./entities/views.entity";

@Entity({ name: "trainings" })
export class TrainingEntity extends BaseEntity {
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

	@Column({ type: "integer", nullable: true })
	primary_category_id!: number;

	@ManyToOne(() => TrainingCategoryEntity)
	@JoinColumn({ name: "primary_category_id" })
	primary_category?: TrainingCategoryEntity;

	@Column({ type: "integer", nullable: true })
	second_category_id?: number;

	@ManyToOne(() => TrainingCategoryEntity)
	@JoinColumn({ name: "second_category_id" })
	secondary_category!: TrainingCategoryEntity;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	user_id?: number;

	@OneToMany(
		() => TrainingViewEntity,
		(TrainingsViews) => TrainingsViews.trainings,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	views?: TrainingViewEntity[];

	@OneToMany(
		() => TrainingLikeEntity,
		(TrainingsLikes) => TrainingsLikes.trainings,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	)
	likes?: TrainingLikeEntity[];
}
