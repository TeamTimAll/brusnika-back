import { Column, Entity } from "typeorm";

import { AbstractEntity } from "../../../../common/abstract.entity";

@Entity("news_categories")
export class NewsCategories extends AbstractEntity {
	@Column({ type: "varchar", length: 255 })
	name!: string;
}
