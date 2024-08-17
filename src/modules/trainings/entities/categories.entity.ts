import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";

@Entity("trainings_categories")
export class TrainingCategoryEntity extends BaseEntity {
	@Column({ type: "varchar", length: 255 })
	name!: string;

	@Column({ type: "integer", default: 0 })
	sequnce_id!: number;
}
