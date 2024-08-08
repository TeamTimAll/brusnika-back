import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { PremiseEntity } from "../premises/premises.entity";
import { SectionEntity } from "../sections/sections.entity";

@Entity({ name: "buildings" })
export class BuildingEntity extends BaseEntity {
	@Column()
	name!: string;

	// storage
	@Column({ nullable: true })
	total_storage!: number;

	// vacant storage
	@Column({ nullable: true })
	total_vacant_storage!: number;

	// total parking space
	@Column({ nullable: true })
	total_parking_space!: number;

	// total vacant parking space
	@Column({ nullable: true })
	total_vacant_parking_space!: number;

	// commercial
	@Column({ nullable: true })
	total_commercial!: number;

	// vacant commercail
	@Column({ nullable: true })
	total_vacant_commercial!: number;

	@Column({ nullable: true })
	address!: string;

	@Column({ nullable: true })
	number_of_floors!: number;

	// TODO: change this columns
	total_apartment!: number;
	total_vacant_apartment!: number;

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

	@OneToMany(
		() => SectionEntity,
		(SectionsEntity) => SectionsEntity.building,
	)
	sections?: SectionEntity[];
}
