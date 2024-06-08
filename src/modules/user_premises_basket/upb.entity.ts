import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { PremisesEntity } from "../premises/premises.entity";
import { UserPremisesBasketMetaEntity } from "../user_premises_basket_meta/upbm.entity";

import { UserPremisesBasketDto } from "./dtos/upb.dto";

@Entity({ name: "user_premises_basket" })
@UseDto(UserPremisesBasketDto)
export class UserPremisesBasketEntity extends AbstractEntity<UserPremisesBasketDto> {
	@ManyToOne(() => UserPremisesBasketMetaEntity)
	@JoinColumn({ name: "meta_id" })
	meta!: UserPremisesBasketMetaEntity;

	@Column({ nullable: true })
	meta_id?: string;

	@ManyToOne(() => PremisesEntity)
	@JoinColumn({ name: "premise_id" })
	premises!: PremisesEntity[];

	@Column({ nullable: true })
	premise_id?: string;
}
