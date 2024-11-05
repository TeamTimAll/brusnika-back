import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../../common/base/base.entity";

@Entity({ name: "premise_basket_link" })
export class PremiseBasketLinkEntity extends BaseEntity {
	@Column({ type: "varchar" })
	link!: string;

	@Column({ type: "json", default: [] })
	ids!: number[];

	@Column()
	page!: number;

	@Column()
	limit!: number;
}
