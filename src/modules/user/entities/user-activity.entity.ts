import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";
import { UserEntity } from "../user.entity";

@Entity({ name: "users_activities" })
export class UserActivityEntity extends BaseEntity {
	@ManyToOne(() => UserEntity, { onDelete: "CASCADE", onUpdate: "NO ACTION" })
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer", nullable: true })
	user_id?: number;
}
