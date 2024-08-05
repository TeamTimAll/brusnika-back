import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";

@Entity("news_categories")
export class NewsCategoryEntity extends BaseEntity {
	@Column({ type: "varchar", length: 255 })
	name!: string;
}
