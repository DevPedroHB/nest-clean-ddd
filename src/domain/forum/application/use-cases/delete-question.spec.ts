import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { Question } from "../../enterprise/entities/question";
import { DeleteQuestionUseCase } from "./delete-question";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteQuestionUseCase;
let question: Question;

describe("Delete question", () => {
  beforeEach(async () => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
    question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    for (let i = 0; i < 5; i++) {
      inMemoryQuestionAttachmentsRepository.items.push(
        makeQuestionAttachment({
          questionId: question.id,
        }),
      );
    }
  });

  it("should be able to delete a question", async () => {
    const result = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const result = await sut.execute({
      authorId: "other-author-id",
      questionId: question.id.toString(),
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
