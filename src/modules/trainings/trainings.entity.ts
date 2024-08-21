import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { RoleType } from "../../constants";
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

	@Column({ type: "boolean", default: false })
	is_show!: boolean;

	@Column({ type: "boolean", default: false })
	is_copy_enabled!: boolean;

	@Column({ type: "text", nullable: true })
	extra_like_icon!: string;

	@Column({ type: "enum", enum: RoleType, nullable: true })
	access_role?: RoleType;

	@ManyToOne(() => UserEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	access_user?: UserEntity;

	@Column({ type: "integer", nullable: true })
	access_user_id?: number;

	@Column({
		type: "timestamp without time zone",
		nullable: true,
		default: () => "CURRENT_TIMESTAMP",
	})
	published_at!: Date;

	@Column({ type: "integer", nullable: true })
	category_id!: number;

	@ManyToOne(() => TrainingCategoryEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "category_id" })
	category?: TrainingCategoryEntity;

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
