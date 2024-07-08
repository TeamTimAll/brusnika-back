import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { NewsEntity } from "../../news.entity";

@Entity("news_views")
export class NewsViews extends AbstractEntity {
	@Column({ type: "integer", nullable: false })
	user_id!: number;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer", nullable: false })
	news_id!: number;

	@ManyToOne(() => NewsEntity)
	@JoinColumn({ name: "news_id" })
	news!: NewsEntity;
}
