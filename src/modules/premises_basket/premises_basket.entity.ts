import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { PremiseEntity } from "../premises/premises.entity";
import { PremisesBasketMetaEntity } from "../premises_basket_meta/premises_basket_meta.entity";

@Entity({ name: "premises_basket" })
export class PremisesBasketEntity extends BaseEntity {
	@ManyToOne(() => PremisesBasketMetaEntity)
	@JoinColumn({ name: "meta_id" })
	meta!: PremisesBasketMetaEntity;

	@Column({ type: "integer", nullable: true })
	meta_id?: number;

	@ManyToOne(() => PremiseEntity)
	@JoinColumn({ name: "premise_id" })
	premises!: PremiseEntity[];

	@Column({ type: "integer", nullable: true })
	premise_id?: number;
}
