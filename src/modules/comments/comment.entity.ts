import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../common/base/base.entity";

@Entity({ name: "comments" })
export class CommentEntity extends BaseEntity {
	@Column({ type: "text" })
	text!: string;
}
