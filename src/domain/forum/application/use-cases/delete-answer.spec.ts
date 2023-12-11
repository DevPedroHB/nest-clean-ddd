import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { DeleteAnswerUseCase } from "./delete-answer";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;
let answer: Answer;

describe("Delete answer", () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
    answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    for (let i = 0; i < 5; i++) {
      inMemoryAnswerAttachmentsRepository.items.push(
        makeAnswerAttachment({
          answerId: answer.id,
        }),
      );
    }
  });

  it("should be able to delete a answer", async () => {
    const result = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryAnswersRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const result = await sut.execute({
      authorId: "other-author-id",
      answerId: answer.id.toString(),
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
