import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { UserEntity } from "../user/user.entity";

import { UserPremisesBasketMetaDto } from "./dtos/upbm.dto";

@Entity({ name: "user_premises_basket_meta" })
@UseDto(UserPremisesBasketMetaDto)
export class UserPremisesBasketMetaEntity extends AbstractEntity<UserPremisesBasketMetaDto> {
	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ nullable: true })
	user_id?: string;
}
