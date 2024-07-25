import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BuildingsEntity } from "../buildings/buildings.entity";
import { PremisesEntity } from "../premises/premises.entity";

@Entity({ name: "sections" })
export class SectionsEntity extends BaseEntity {
	@Column({ nullable: true, type: "varchar" })
	name!: string;

	@ManyToOne(
		() => BuildingsEntity,
		(BuildingsEntity) => BuildingsEntity.sections,
		{
			onDelete: "SET NULL",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn({ name: "building_id" })
	building!: BuildingsEntity;

	@Column({ type: "integer", nullable: true })
	building_id?: number;

	@OneToMany(() => PremisesEntity, (PremisesEntity) => PremisesEntity.section)
	premises?: PremisesEntity[];
}
