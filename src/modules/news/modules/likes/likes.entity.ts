import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { NewsEntity } from "../../news.entity";

@Entity("news_likes")
export class NewsLikes extends AbstractEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	news_id!: number;

	@OneToOne(() => NewsEntity)
	@JoinColumn()
	news!: NewsEntity;
}
