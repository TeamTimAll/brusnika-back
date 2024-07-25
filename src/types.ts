export interface Links {
	totalPage: number;
	currPage: number;
	limit: number;
	total: number;
}

export interface ServiceResponse<T> {
	links: Links;
	data: T;
}
