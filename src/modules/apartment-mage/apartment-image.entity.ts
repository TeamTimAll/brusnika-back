import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

@Entity("apartment_image")
export class ApartmentImageEntity extends BaseEntity {
	@Column({ type: "text" })
	image!: string;
}
