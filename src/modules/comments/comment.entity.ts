import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: "comments" })
export class CommentEntity extends BaseEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@ManyToOne(() => UserEntity, (userEntity) => userEntity.comments, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ nullable: true, type: "integer" })
	comment_id?: number;

	@Column({ nullable: true, type: "text" })
	comment?: string;
}
