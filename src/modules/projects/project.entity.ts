import { UseDto } from "../../decorators";
import { Entity, Column, OneToMany } from "typeorm";
import { ProjectSDto } from "./dto/projects.dto";
import { AbstractEntity } from "../../common/abstract.entity";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { ClientEntity } from "../client/client.entity";
import { DealsEntity } from "../deals/deals.entity";

@Entity({ name: "projects" })
@UseDto(ProjectSDto)
export class ProjectEntity extends AbstractEntity<ProjectSDto> {
	@Column({ nullable: true })
	name!: string;

	@Column({ nullable: true })
	detailedDescription!: string;

	@Column({ nullable: true })
	briefDescription!: string;

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
