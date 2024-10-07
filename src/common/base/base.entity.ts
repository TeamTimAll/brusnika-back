import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "boolean", default: true })
	is_active!: boolean;

	@Column({ type: "text", nullable: true, unique: true })
	ext_id!: string | null;

	@CreateDateColumn({ type: "timestamptz" })
	created_at!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updated_at!: Date;

	// @ManyToOne(() => UserEntity)
	// create_by!: UserEntity;
}
