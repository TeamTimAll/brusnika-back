import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";
import { UserEntity } from "../../../user/user.entity";
import { TrainingsEntity } from "../../trainings.entity";

@Entity("trainings_views")
export class TrainingsViews extends AbstractEntity {
	@Column({ type: "uuid", nullable: false })
	user_id!: string;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "uuid", nullable: false })
	trainings_id!: string;

	@ManyToOne(() => TrainingsEntity)
	@JoinColumn({ name: "trainings_id" })
	trainings!: TrainingsEntity;
}
