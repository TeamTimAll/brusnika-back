import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { UserEntity } from "../user/user.entity";

import { CommentDto } from "./dtos/comment.dto";

@Entity({ name: "comments" })
@UseDto(CommentDto)
export class CommentEntity extends AbstractEntity<CommentDto> {
	@Column({ type: "uuid" })
	userId!: string;

	@ManyToOne(() => UserEntity, (userEntity) => userEntity.comments, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	// @ManyToOne(() => EventsEntity, (eventsEntity) => eventsEntity.comments, {
	//   onDelete: 'CASCADE',
	//   onUpdate: 'CASCADE',
	// })

	// @JoinColumn({ name: 'event_id' })
	// event!: EventsEntity;

	// @Column({ type: 'uuid' })
	// eventId!: Uuid;

	@Column({ nullable: true, type: "text" })
	commentId?: string;

	@Column({ nullable: true, type: "text" })
	comment?: string;
}
