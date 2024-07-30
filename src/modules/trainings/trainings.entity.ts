import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";

import { TrainingsCategories } from "./modules/categories/categories.entity";
import { TrainingsLikes } from "./modules/likes/likes.entity";
import { TrainingsViews } from "./modules/views/views.entity";

@Entity({ name: "trainings" })
export class TrainingsEntity extends BaseEntity {
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

	@OneToOne(() => TrainingsCategories)
	@JoinColumn({ name: "primary_category_id" })
	primary_category?: TrainingsCategories;

	@Column({ type: "integer", nullable: true })
	second_category_id?: number;

	@OneToOne(() => TrainingsCategories)
	@JoinColumn({ name: "second_category_id" })
	secondary_category!: TrainingsCategories;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	user_id?: number;

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
}
