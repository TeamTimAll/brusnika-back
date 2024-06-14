import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { PremisesEntity } from "../premises/premises.entity";
import { PremisesBasketMetaEntity } from "../premises_basket_meta/premises_basket_meta.entity";

import { PremisesBasketDto } from "./dtos/premises_basket.dto";

@Entity({ name: "premises_basket" })
@UseDto(PremisesBasketDto)
export class PremisesBasketEntity extends AbstractEntity<PremisesBasketDto> {
	@ManyToOne(() => PremisesBasketMetaEntity)
	@JoinColumn({ name: "meta_id" })
	meta!: PremisesBasketMetaEntity;

	@Column({ nullable: true })
	meta_id?: string;

	@ManyToOne(() => PremisesEntity)
	@JoinColumn({ name: "premise_id" })
	premises!: PremisesEntity[];

	@Column({ nullable: true })
	premise_id?: string;
}
