import * as fs from "fs";
import { join } from "path";

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { FileNotFoundError } from "../common/errors/FileNotFoundError";

@Injectable()
export class StaticFilesMiddleware implements NestMiddleware {
	use(req: Request, _res: Response, next: NextFunction) {
		if (!req.path) {
			next();
			return;
		}
		const [, , , fileName] = req.path.split("/");
		const filePath = join(__dirname, "..", "..", "media", fileName);

		try {
			const stats = fs.statSync(filePath);
			if (!stats.isFile()) {
				throw new FileNotFoundError(`file: ${fileName}`);
			}
		} catch (e) {
			throw new FileNotFoundError(`file: ${fileName}`);
		}

		next();
	}
}
