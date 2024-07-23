import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { NewsEntity } from "../../news.entity";

@Entity("news_likes")
@Unique(["user_id", "news_id"])
export class NewsLikes extends AbstractEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	news_id!: number;

	@ManyToOne(() => NewsEntity)
	@JoinColumn({ name: "news_id" })
	news!: NewsEntity;
}
