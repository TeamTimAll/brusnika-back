import { IsString, IsNotEmpty } from "class-validator";

export class AddCommentDto {
	@IsString()
	@IsNotEmpty()
	userId!: string;

	@IsString()
	@IsNotEmpty()
	eventId!: string;

	@IsString()
	@IsNotEmpty()
	comment: string;

	constructor() {
		this.comment = "";
	}
}
