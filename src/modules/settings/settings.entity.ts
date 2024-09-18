import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";
import { CityEntity } from "../cities/cities.entity";

@Entity("settings")
export class SettingsEntity extends BaseEntity {
	@Column({ type: "integer", default: 0 })
	booking_limit!: number;

	@Column({ type: "integer", default: 0 })
	training_show_date_limit!: number;

	banner?: CityEntity[];
}
