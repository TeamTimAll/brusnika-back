import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { CitiesEntity } from "../cities/cities.entity";
import { VisitsEntity } from "../visits/visits.entity";

import { ProjectDto } from "./dto/projects.dto";

@Entity({ name: "projects" })
@UseDto(ProjectDto)
export class ProjectEntity extends AbstractEntity<ProjectDto, ProjectDto> {
	@Column({ nullable: true })
	name!: string;

	@Column({ nullable: true })
	detailed_description!: string;

	@Column({ nullable: true })
	brief_description!: string;

	@Column({ nullable: true })
	photo!: string;

	@OneToMany(() => BuildingsEntity, (buildings) => buildings.project)
	buildings?: BuildingsEntity[];

	@Column({ nullable: true })
	price!: number;

	@Column({ nullable: true })
	location!: string;

	@Column({ nullable: true, type: "varchar" })
	long!: string;

	@Column({ nullable: true, type: "varchar" })
	lat!: string;

	@Column({ nullable: true, type: "varchar" })
	link!: string;

	@Column({ nullable: true, type: "date" })
	end_date!: Date;

	@ManyToOne(() => CitiesEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "city_id" })
	city!: CitiesEntity;

	@Column({ nullable: true, type: "integer" })
	city_id?: number;

	@OneToMany(() => VisitsEntity, (VisitsEntity) => VisitsEntity.project)
	visits?: VisitsEntity[];
}
