import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { WithOutToDto } from "../../types";
import { PremisesEntity } from "../premises/premises.entity";
import { SectionsEntity } from "../sections/sections.entity";

@Entity({ name: "buildings" })
export class BuildingsEntity extends AbstractEntity {
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
	photos: string[] = [];

	@ManyToOne(() => ProjectEntity, (project) => project.buildings, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({ type: "uuid" })
	project_id!: Uuid;

	@OneToMany(() => PremisesEntity, (Premises) => Premises.building)
	premises?: PremisesEntity[];

	@OneToMany(
		() => SectionsEntity,
		(SectionsEntity) => SectionsEntity.building,
	)
	sections?: SectionsEntity[];

	static toDto(
		entity: Partial<WithOutToDto<BuildingsEntity>>,
	): WithOutToDto<BuildingsEntity> {
		const dto: WithOutToDto<BuildingsEntity> = {
			id: entity.id ?? "",
			name: entity.name ?? "",
			total_storage: entity.total_storage ?? 0,
			total_vacant_storage: entity.total_vacant_storage ?? 0,
			total_parking_space: entity.total_parking_space ?? 0,
			total_vacant_parking_space: entity.total_vacant_parking_space ?? 0,
			total_commercial: entity.total_commercial ?? 0,
			total_vacant_commercial: entity.total_vacant_commercial ?? 0,
			address: entity.address ?? "",
			number_of_floors: entity.number_of_floors ?? 0,
			photos: entity.photos ?? [],
			project_id: entity.project_id ?? "",
			project: entity.project ?? new ProjectEntity(),
			premises: entity.premises ?? [],
			sections: entity.sections ?? [],
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
			total_apartment: entity.total_apartment ?? 0,
			total_vacant_apartment: entity.total_vacant_apartment ?? 0,
		};

		return dto;
	}
}
