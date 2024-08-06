import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BuildingEntity } from "../buildings/buildings.entity";
import { PremiseEntity } from "../premises/premises.entity";

@Entity({ name: "sections" })
export class SectionsEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	name!: string;

	@ManyToOne(
		() => BuildingEntity,
		(BuildingsEntity) => BuildingsEntity.sections,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "building_id" })
	building!: BuildingEntity;

	@Column({ type: "integer", nullable: true })
	building_id?: number;

	@OneToMany(() => PremiseEntity, (PremisesEntity) => PremisesEntity.section)
	premises?: PremiseEntity[];
}
