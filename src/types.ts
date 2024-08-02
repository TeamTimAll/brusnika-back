export interface Links {
	totalPage: number;
	currPage: number;
	limit: number;
	total: number;
}

export class ServiceResponse<T> {
	links!: Links;
	data = [] as T;
}
