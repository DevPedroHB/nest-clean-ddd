import { UploadParams } from "@/core/repositories/upload-params";

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>;
}
