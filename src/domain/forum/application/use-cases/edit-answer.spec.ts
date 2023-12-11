import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { EditAnswerUseCase } from "./edit-answer";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;
let answer: Answer;

describe("Edit answer", () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
    answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    for (let i = 0; i < 2; i++) {
      inMemoryAnswerAttachmentsRepository.items.push(
        makeAnswerAttachment({
          answerId: answer.id,
        }),
      );
    }
  });

  it("should be able to edit a answer", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
      content: "New content",
      authorId: answer.authorId.toString(),
      attachmentsIds: ["0", "1"],
    });

    expect(result.isSuccess()).toBe(true);
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("0") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      ],
    );
  });

  it("should not be able to edit a answer from another user", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
      content: "New content",
      authorId: "other-author-id",
      attachmentsIds: [],
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should sync new and removed attachments when editing a answer", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "New content",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("2"),
        }),
      ]),
    );
  });
});
