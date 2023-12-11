import { Question } from "@/domain/forum/enterprise/entities/question";
import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchQuestionAnswersUseCase;
let question: Question;

describe("Fetch question answers", () => {
  beforeEach(async () => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository,
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
    question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
        }),
      );
    }
  });

  it("should be able fetch question answers", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value?.answers).toHaveLength(20);
  });

  it("should be able to fetch paginated questions answers", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});
