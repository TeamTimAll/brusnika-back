import fs from "fs";

// import { Logger } from "@nestjs/common";

import { ConfigManager } from "../config";
import { FirebaseConfig, FirebaseService } from "../lib/firebase";

// import { RabbitMQClient } from "./RabbitMQ";
import { Http } from "./http";
import { OrmManager } from "./orm";
import { SwaggerManager } from "./swagger";

export class Application {
	static async init() {
		ConfigManager.init();
		OrmManager.init();

		await Http.init();
		SwaggerManager.init(Http.app);
		await Http.listen();

		const firebaseConfigData = fs.readFileSync("./firebase.json", "utf8");
		if (!firebaseConfigData && !firebaseConfigData.length) {
			throw new Error("Firebase config not found!");
		}
		const firebaseConfig = JSON.parse(firebaseConfigData) as FirebaseConfig;

		FirebaseService.init(firebaseConfig);

		// await RabbitMQClient.init(new Logger("RabbitMQServer"));
		// await RabbitMQClient.listen();
	}
}
