import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { ManyToOne, Column, Entity, OneToMany, JoinColumn } from "typeorm";
import { Uuid } from "boilerplate.polyfill";
import { PremisesEntity } from "../premises/premises.entity";
import { SectionsEntity } from "../sections/sections.entity";
import { WithOutToDto } from "types";

@Entity({ name: "buildings" })
export class BuildingsEntity extends AbstractEntity {
	@Column()
	name!: string;

	// storage
	@Column({ nullable: true })
	totalStorage!: number;

	// vacant storage
	@Column({ nullable: true })
	totalVacantStorage!: number;

	// total parking space
	@Column({ nullable: true })
	totalParkingSpace!: number;

	// total vacant parking space
	@Column({ nullable: true })
	totalVacantParkingSpace!: number;

	// commercial
	@Column({ nullable: true })
	totalCommercial!: number;

	// vacant commercail
	@Column({ nullable: true })
	totalVacantCommercial!: number;

	@Column({ nullable: true })
	address!: string;

	@Column({ nullable: true })
	numberOfFloors!: number;

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
			totalStorage: entity.totalStorage ?? 0,
			totalVacantStorage: entity.totalVacantStorage ?? 0,
			totalParkingSpace: entity.totalParkingSpace ?? 0,
			totalVacantParkingSpace: entity.totalVacantParkingSpace ?? 0,
			totalCommercial: entity.totalCommercial ?? 0,
			totalVacantCommercial: entity.totalVacantCommercial ?? 0,
			address: entity.address ?? "",
			numberOfFloors: entity.numberOfFloors ?? 0,
			photos: entity.photos ?? [],
			project_id: entity.project_id ?? "",
			project: entity.project ?? new ProjectEntity(),
			premises: entity.premises ?? [],
			sections: entity.sections ?? [],
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
		};

		return dto;
	}
}
