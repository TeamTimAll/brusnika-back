export interface IClient {
	url: string;
	method: string;
	data: {
		requestType: string;
		contourId: string;
		contactType: {
			isClient: boolean;
		};
		realtor: {
			agentId: number;
			phone: string | null;
			name: string;
		};
		agency: {
			name?: string | null;
		};
		client: {
			phone: string;
			name: string;
		};
		contact: string;
	};
}
