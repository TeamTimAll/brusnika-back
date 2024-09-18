import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { CityEntity } from "../cities/cities.entity";

@Entity("banner")
export class BannerEntity extends BaseEntity {
	@Column({ type: "text" })
	cover_image!: string;

	@Column({ type: "text", nullable: true })
	title?: string;

	@Column({ type: "text" })
	link!: string;

	@Column({ type: "boolean", default: false })
	open_in_tab!: boolean;

	@ManyToOne(() => CityEntity, (c) => c.banner, {
		onDelete: "SET NULL",
		onUpdate: "SET NULL",
	})
	@JoinColumn({ name: "city_id" })
	city!: CityEntity;

	@Column({ type: "int", nullable: true })
	city_id?: number;
}
