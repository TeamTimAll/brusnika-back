import fs from "fs";

import { ConfigManager } from "../config";
import { FirebaseConfig, FirebaseService } from "../lib/firebase";

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
	}
}
