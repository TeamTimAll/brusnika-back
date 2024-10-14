import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { BuildingEntity } from "../../modules/buildings/buildings.entity";
import { VisitsEntity } from "../visits/visits.entity";
import { CityEntity } from "../cities/cities.entity";

@Entity({ name: "projects" })
export class ProjectEntity extends BaseEntity {
	@Column({ nullable: false })
	photo!: string;

	@Column({ nullable: false })
	name!: string;

	@Column({ nullable: false })
	description!: string;

	@Column({ nullable: true, type: "date" })
	end_date!: Date;

	@Column({ nullable: true })
	location!: string;

	@Column({ nullable: true, type: "varchar" })
	long!: string;

	@Column({ nullable: true, type: "varchar" })
	lat!: string;

	@OneToMany(() => BuildingEntity, (buildings) => buildings.project)
	buildings?: BuildingEntity[];

	@Column({ nullable: false })
	company_link!: string;

	@Column({ nullable: false })
	building_link!: string;

	@Column({ nullable: false })
	project_link!: string;

	@ManyToOne(() => CityEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "city_id" })
	city!: CityEntity;

	@Column({ nullable: false })
	city_id?: number;

	@Column({ nullable: false })
	price!: number;

	@OneToMany(() => VisitsEntity, (VisitsEntity) => VisitsEntity.project)
	visits?: VisitsEntity[];
}
