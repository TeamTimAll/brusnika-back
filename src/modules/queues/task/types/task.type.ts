export interface ITask {
	url: string;
	method: string;
	data: {
		authorId?: string | null;
		ownerId?: string | null;
		methodCarryng: string;
		description?: string;
		deadline: Date;
		premiseKind?: string;
		projectId?: string | null;
		roomsId: string | null;
	};
}
