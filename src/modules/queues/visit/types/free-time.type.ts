export interface IVisitFreeTime {
	url: string;
	method: string;
	data: {
		requestType: string;
		type: string;
		project?: string | null;
		premisesKind: string | null;
	};
}
