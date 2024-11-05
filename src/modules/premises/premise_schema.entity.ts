import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

import { PremiseEntity } from "./premises.entity";

@Entity("premise_schemas")
export class PremiseSchemaEntity extends BaseEntity {
	@Column({ type: "integer", default: 0, nullable: true })
	sunrise_angle?: number;

	@Column({ type: "text", nullable: true })
	schema_image?: string;

	@OneToOne(() => PremiseEntity, (p) => p.schema, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "premise_id" })
	premise!: PremiseEntity;

	@Column({ type: "integer" })
	premise_id!: number;
}
