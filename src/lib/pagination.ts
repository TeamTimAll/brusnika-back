import { Links } from "../types";

export function calcPagination(
	count: number,
	page: number,
	limit: number,
): Links {
	const maxPage = Math.ceil(count / limit);
	return {
		currPage: page,
		totalPage: maxPage,
		limit: limit,
		total: count,
	};
}

export function createLink(links: Links): Links {
	return {
		currPage: links.currPage,
		totalPage: links.totalPage,
		limit: links.limit,
		total: links.total,
	};
}
