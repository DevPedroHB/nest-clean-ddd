import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { Answer } from "../../enterprise/entities/answer";
import { Question } from "../../enterprise/entities/question";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ChooseQuestionBestAnswerUseCase;
let question: Question;
let answer: Answer;

describe("Choose question best answer", () => {
  beforeEach(async () => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository,
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
    question = makeQuestion();
    answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);
  });

  it("should be able to choose the question best answer", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      answer.id,
    );
  });

  it("should not be able to choose another user question best answer", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "other-author-id",
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
