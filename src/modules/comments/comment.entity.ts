import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { UserEntity } from "../user/user.entity";

import { CommentDto } from "./dtos/comment.dto";

@Entity({ name: "comments" })
@UseDto(CommentDto)
export class CommentEntity extends AbstractEntity<CommentDto> {
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
