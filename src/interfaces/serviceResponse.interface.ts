// Service Response abstraction
// Usage: to replacing the service output with a template
export class ServiceResponse<T = unknown> {
	message: string[];
	statusCode: number;
	data: T[];

	constructor(message: string[], statusCode: number, data?: T[]) {
		this.message = message;
		this.statusCode = statusCode;
		this.data = data ?? [];
	}
}
