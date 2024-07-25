import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn({ type: "timestamp" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updatedAt!: Date;

	// @ManyToOne(() => UserEntity)
	// create_by!: UserEntity;
}
