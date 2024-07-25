import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

import { NewsCategories } from "./modules/categories/categories.entity";
import { NewsLikes } from "./modules/likes/likes.entity";
import { NewsViews } from "./modules/views/views.entity";

@Entity({ name: "news" })
export class NewsEntity extends BaseEntity {
	@Column({ type: "integer" })
	user_id!: number;

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

	@Column({ type: "integer", nullable: true })
	second_category_id?: number;

	@OneToOne(() => NewsCategories)
	@JoinColumn({ name: "primary_category_id" })
	primary_category?: NewsCategories;

	@OneToOne(() => NewsCategories)
	@JoinColumn({ name: "second_category_id" })
	secondary_category!: NewsCategories;

	@OneToMany(() => NewsViews, (NewsViews) => NewsViews.news, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	views?: NewsViews[];

	@OneToMany(() => NewsLikes, (NewsLikes) => NewsLikes.news, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	likes?: NewsLikes[];
}
