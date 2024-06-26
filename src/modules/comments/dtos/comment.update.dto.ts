export class CommentUpdateDto {
	id!: string;
	comment: string;

	constructor() {
		this.comment = "";
	}
}
