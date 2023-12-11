import { InvalidFileTypeError } from "@/core/errors/invalid-file-type-error";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { FakeUploader } from "test/storage/fake-uploader";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "example.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "example.png",
      }),
    );
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "example.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFileTypeError);
  });
});
