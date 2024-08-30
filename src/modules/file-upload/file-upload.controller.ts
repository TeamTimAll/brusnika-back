import {
	Controller,
	Header,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";

import { FileExtensionNotAllowedError } from "../../common/errors/FileExtensionNotAllowedError";
import { FileIsRequiredError } from "../../common/errors/FileIsRequiredError";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { FileUploadService } from "./file-upload.service";

@Controller("/api/file-upload")
@ApiTags("FileUpload endpoints")
@UseInterceptors(TransformInterceptor)
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
			throw new FileIsRequiredError();
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
			callback(
				new FileExtensionNotAllowedError(
					"Allowed file extension: jpg, jpeg, png, gif, pdf, doc",
				),
				false,
			);
		}
		callback(null, true);
	}
}
