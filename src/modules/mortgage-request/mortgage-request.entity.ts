import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ClientEntity } from "../client/client.entity";
import { PremiseEntity } from "../premises/premises.entity";
import { ProjectEntity } from "../projects/project.entity";
import { BuildingEntity } from "../buildings/buildings.entity";

@Entity({ name: "mortgage_request" })
export class MortgageRequestEntity extends BaseEntity {
	@ManyToOne(() => ClientEntity, (c) => c.leads, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	@JoinColumn({ name: "client_id" })
	client!: ClientEntity;

	@Column({ type: "integer", nullable: true })
	client_id!: number;

	@ManyToOne(() => ProjectEntity, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	@JoinColumn({ name: "project_id" })
	building!: BuildingEntity;

	@Column({ type: "integer", nullable: true })
	building_id!: number;

	@ManyToOne(() => PremiseEntity, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	@JoinColumn({ name: "premise_id" })
	premise!: PremiseEntity;

	@Column({ type: "integer" })
	premise_id!: number;

	@Column({ nullable: false, type: "integer" })
	cost!: number;

	@Column({ default: 0, type: "integer" })
	first_payment!: number;

	@Column({ type: "varchar" })
	comment!: string;
}
