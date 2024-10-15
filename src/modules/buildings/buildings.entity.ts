import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { PremiseEntity } from "../premises/premises.entity";
import { SectionEntity } from "../sections/sections.entity";

@Entity({ name: "buildings" })
export class BuildingEntity extends BaseEntity {
	@Column()
	name!: string;

	@Column({ nullable: true })
	address!: string;

	@Column({ nullable: true })
	number_of_floors!: number;

	@Column({ type: "text", array: true, nullable: true })
	photos?: string[];

	@ManyToOne(() => ProjectEntity, (project) => project.buildings, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({ type: "integer" })
	project_id!: number;

	@OneToMany(() => PremiseEntity, (Premises) => Premises.building)
	premises?: PremiseEntity[];

	@OneToMany(() => SectionEntity, (SectionsEntity) => SectionsEntity.building)
	sections?: SectionEntity[];
}
