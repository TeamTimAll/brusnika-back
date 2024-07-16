import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	HttpException,
	HttpStatus,
	Header,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";

import { FileUploadService } from "./file-upload.service";
// ... Other imports

@Controller("/api/file-upload")
@ApiTags("FileUpload endpoints")
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}

	@Post("image")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				image: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@UseInterceptors(
		FileInterceptor("image", {
			// eslint-disable-next-line no-use-before-define, @typescript-eslint/unbound-method
			fileFilter: FileUploadController.imageFileFilter,
			limits: {
				fileSize: 1024 * 1024 * 10 * 4, // Set the maximum file size limit (1 MB in this example)
			},
		}),
	)
	@Header("Content-Type", "application/json")
	@ApiConsumes("multipart/form-data")
	async uploadImage(
		@UploadedFile() file: Express.Multer.File,
	): Promise<{ filename: string }> {
		if (!file) {
			throw new HttpException(
				"Image file required",
				HttpStatus.BAD_REQUEST,
			);
		}

		const filename = await this.fileUploadService.uploadImage(file);
		return { filename };
	}

	private static imageFileFilter(
		_req: unknown,
		file: Express.Multer.File,
		callback: (error: Error | null, acceptFile: boolean) => void,
	): void {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc)$/)) {
			return callback(new Error("Only image files are allowed!"), false);
		}
		callback(null, true);
	}
}
