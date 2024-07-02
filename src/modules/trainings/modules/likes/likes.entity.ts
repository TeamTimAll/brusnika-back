import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { TrainingsEntity } from "../../trainings.entity";

@Entity("trainings_likes")
export class TrainingsLikes extends AbstractEntity {
	@Column("uuid")
	user_id!: string;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id"})
	user!: UserEntity;

	@Column("uuid")
	trainings_id!: string;

	@OneToOne(() => TrainingsEntity)
	@JoinColumn()
	trainings!: TrainingsEntity;
}
