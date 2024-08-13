import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { UserEntity } from "../../user/user.entity";
import { TrainingEntity } from "../trainings.entity";

@Entity("trainings_likes")
@Unique(["user_id", "trainings_id"])
export class TrainingLikeEntity extends BaseEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@ManyToOne(() => UserEntity, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	trainings_id!: number;

	@ManyToOne(() => TrainingEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "trainings_id" })
	trainings!: TrainingEntity;
}
