import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

import { PremiseEntity } from "./premises.entity";

export enum SeasonNumber {
	SPRING = 1,
	SUMMER = 2,
	AUTUMN = 3,
	WINTER = 4,
}

@Entity("seasons")
export class SeasonEntity extends BaseEntity {
	@Column({ type: "enum", enum: SeasonNumber })
	season_name!: SeasonNumber;

	@Column({ type: "varchar", length: 255 })
	year!: string; // "2024";

	@Column({ type: "date" })
	date!: string; // "2024-08-09";

	@OneToMany(() => PremiseEntity, (p) => p.season)
	premise!: PremiseEntity[];
}
