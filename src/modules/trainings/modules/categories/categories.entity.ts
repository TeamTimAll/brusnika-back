import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../../../common/base/base.entity";

@Entity("trainings_categories")
export class TrainingsCategories extends BaseEntity {
	@Column({ type: "varchar", length: 255 })
	name!: string;
}
