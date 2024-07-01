import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";

import { NewsDto } from "./dto/news.dto";
import { NewsCategories } from "./modules/categories/categories.entity";
import { NewsLikes } from "./modules/likes/likes.entity";
import { NewsViews } from "./modules/views/views.entity";

@Entity({ name: "news" })
@UseDto(NewsDto)
export class NewsEntity extends AbstractEntity<NewsDto> {
	@Column({ type: "uuid" })
	userId!: string;

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

	@OneToOne(() => NewsCategories)
	@JoinColumn({ name: "primary_category_id" })
	primary_category?: NewsCategories;

	@Column({ type: "uuid", nullable: true })
	second_category_id?: string;

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

	static toDto(
		entity: Partial<WithOutToDto<NewsEntity>>,
	): WithOutToDto<NewsEntity> {
		const dto: WithOutToDto<NewsEntity> = {
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
			primary_category: entity.primary_category ?? new NewsCategories(),
			secondary_category: entity.secondary_category ?? new NewsCategories(),
			userId: ""
		};
		return dto;
	}
}
