import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { WithOutToDto } from "types";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { BuildingsEntity } from "../buildings/buildings.entity";
import { PremisesEntity } from "../premises/premises.entity";

import { SectionsDto } from "./dtos/sections.dto";

@Entity({ name: "sections" })
@UseDto(SectionsDto)
export class SectionsEntity extends AbstractEntity<SectionsDto> {
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

	static toDto(
		entity: Partial<WithOutToDto<SectionsEntity>>,
	): WithOutToDto<SectionsEntity> {
		const dto: WithOutToDto<SectionsEntity> = {
			id: entity.id ?? 0,
			name: entity.name ?? "",
			building: entity.building ?? new BuildingsEntity(),
			building_id: entity.building_id ?? 0,
			premises: entity.premises ?? [],
			createdAt: entity.createdAt ?? new Date(),
			updatedAt: entity.updatedAt ?? new Date(),
		};
		return dto;
	}
}
