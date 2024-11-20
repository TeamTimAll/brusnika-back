export interface IUser {
	url: string;
	method: string;
	data: {
		requestType: string;
		contourId: string;
		data: {
			phone: string | null;
			name: string | null;
			surname: string | null;
			patronymic: string | null;
			email?: string | null;
			work_region?: string;
			type: string | null;
			inn?: string | null;
		};
	};
}
