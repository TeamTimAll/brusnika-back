import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { UserEntity } from "../user/user.entity";

@Entity("analytics")
export class AnalyticsEntity extends BaseEntity {
	@Column({ type: "integer", default: 0 })
	all_created_entity_count!: number;

	@Column({ type: "integer", default: 0 })
	all_created_clients_count!: number;

	@Column({ type: "integer", default: 0 })
	all_success_leads_count!: number;

	@Column({ type: "bigint", default: 0 })
	avg_success_leads_sum!: bigint;

	@Column({ type: "float", default: 0 })
	avg_success_leads_m2!: number;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	active_at!: Date;

	@ManyToOne(() => UserEntity, {
		onUpdate: "NO ACTION",
		onDelete: "SET NULL",
	})
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ type: "integer" })
	user_id!: number;
}
