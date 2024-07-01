import { Column, Entity } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";

@Entity("trainings_categories")
export class TrainingsCategories extends AbstractEntity {
	@Column({ type: "varchar", length: 255 })
	name!: string;
}
