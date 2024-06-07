import { Column, Entity, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { ClientEntity } from "../client/client.entity";
import { DealsEntity } from "../deals/deals.entity";

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

	@OneToMany(() => ClientEntity, (client) => client.project)
	clients?: ClientEntity[];

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

	@OneToMany(() => DealsEntity, (deal) => deal.project)
	deals?: DealsEntity[];
}
