import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { NewsEntity } from "../../news.entity";

@Entity("news_likes")
export class NewsLikes extends AbstractEntity {
	@Column("uuid")
	user_id!: string;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id"})
	user!: UserEntity;

	@Column("uuid")
	news_id!: string;

	@OneToOne(() => NewsEntity)
	@JoinColumn()
	news!: NewsEntity;
}
