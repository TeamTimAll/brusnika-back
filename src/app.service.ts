// import { Injectable } from "@nestjs/common";
// import { Counter } from "prom-client";
// import { InjectMetric } from "@willsoto/nestjs-prometheus";

// @Injectable()
// export class AppService {
// 	constructor(
// 		@InjectMetric("http_requests_total")
// 		private readonly counter: Counter<string>,
// 	) {}

// 	handleRequest() {
// 		this.counter.inc();
// 	}
// }
