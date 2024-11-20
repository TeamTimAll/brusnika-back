export interface IClient {
	url: string;
	method: string;
	data: {
		requestType: string;
		contourId: string;
		realtor: {
			phone: string | null;
			name: string;
		};
		agency: {
			name: string | null;
		};
		client: {
			phone: string;
			name: string;
		};
		contact: string;
	};
}
