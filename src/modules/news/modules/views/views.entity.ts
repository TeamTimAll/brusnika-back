import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { NewsEntity } from "../../news.entity";

@Entity("news_views")
export class NewsViews extends AbstractEntity {
	@Column({ type: "uuid", nullable: false })
	user_id!: string;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "uuid", nullable: false })
	news_id!: string;

	@ManyToOne(() => NewsEntity)
	@JoinColumn({ name: "news_id" })
	news!: NewsEntity;
}
