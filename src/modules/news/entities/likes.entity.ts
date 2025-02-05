import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { UserEntity } from "../../user/user.entity";
import { NewsEntity } from "../news.entity";

@Entity("news_likes")
@Unique(["user_id", "news_id"])
export class NewsLikeEntity extends BaseEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	news_id!: number;

	@ManyToOne(() => NewsEntity, {
		onDelete: "CASCADE",
		onUpdate: "NO ACTION",
	})
	@JoinColumn({ name: "news_id" })
	news!: NewsEntity;
}
