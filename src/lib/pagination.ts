import { Links } from "../types";

export function calcPagination(
	count: number,
	page: number,
	limit: number,
): Links {
	const maxPage = Math.ceil(count / limit);
	const nextPage = maxPage <= page ? null : page + 1;
	return {
		self: page,
		next: nextPage,
		last: maxPage,
		limit: limit,
	};
}

export function createLink(links: Links) {
	return {
		last: `page=${links.last}?limit=${links.limit}`,
		next: `page=${links.next}?limit=${links.limit}`,
		self: `page=${links.self}?limit=${links.limit}`,
	};
}
