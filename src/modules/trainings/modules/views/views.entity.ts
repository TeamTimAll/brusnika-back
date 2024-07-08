import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { TrainingsEntity } from "../../trainings.entity";

@Entity("trainings_views")
export class TrainingsViews extends AbstractEntity {
	@Column({ type: "integer", nullable: false })
	user_id!: number;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer", nullable: false })
	trainings_id!: number;

	@ManyToOne(() => TrainingsEntity)
	@JoinColumn({ name: "trainings_id" })
	trainings!: TrainingsEntity;
}
