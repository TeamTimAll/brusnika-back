import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { RoleType } from "../../constants";
import { CityEntity } from "../../modules/cities/cities.entity";

import { NewsCategoryEntity } from "./entities/categories.entity";
import { NewsLikeEntity } from "./entities/likes.entity";
import { NewsViewEntity } from "./entities/views.entity";

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

	@Column({ type: "enum", enum: RoleType, nullable: true })
	access?: RoleType;

	@Column({ type: "boolean", default: false })
	is_banner!: boolean;

	@Column({ type: "boolean", default: false })
	is_draft!: boolean;

	@Column({ type: "integer", nullable: true })
	primary_category_id?: number;

	@Column({ type: "integer", nullable: true })
	second_category_id?: number;

	@ManyToOne(() => NewsCategoryEntity)
	@JoinColumn({ name: "primary_category_id" })
	primary_category?: NewsCategoryEntity;

	@ManyToOne(() => NewsCategoryEntity)
	@JoinColumn({ name: "second_category_id" })
	secondary_category!: NewsCategoryEntity;

	@OneToMany(() => NewsViewEntity, (NewsViews) => NewsViews.news, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	views?: NewsViewEntity[];

	@OneToMany(() => NewsLikeEntity, (NewsLikes) => NewsLikes.news, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	likes?: NewsLikeEntity[];

	@ManyToOne(() => CityEntity, (citiesEntity) => citiesEntity.users, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "city_id" })
	city?: CityEntity;

	@Column({ type: "integer", nullable: true })
	city_id?: number;
}
