import { PartialType } from "@nestjs/swagger";

import { CreateBannerDto, CreateBannerMetaDataDto } from "./CreateBanner.dto";

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}

export class UpdateBannerMetaDataDto extends CreateBannerMetaDataDto {}
