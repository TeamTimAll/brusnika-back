import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { TrainingsEntity } from "../../trainings.entity";

@Entity("trainings_likes")
export class TrainingsLikes extends AbstractEntity {
	@Column({ type: "integer" })
	user_id!: number;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	trainings_id!: number;

	@OneToOne(() => TrainingsEntity)
	@JoinColumn()
	trainings!: TrainingsEntity;
}
