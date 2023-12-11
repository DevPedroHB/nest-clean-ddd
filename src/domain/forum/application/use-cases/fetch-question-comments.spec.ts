import { User } from "@/domain/account/enterprise/entities/user";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { makeUser } from "test/factories/make-user";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: FetchQuestionCommentsUseCase;
let user: User;
let question: Question;

describe("Fetch question comments", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository,
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryUsersRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
    user = makeUser();
    question = makeQuestion({
      authorId: user.id,
    });

    await inMemoryUsersRepository.create(user);
    await inMemoryQuestionsRepository.create(question);

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
          authorId: user.id,
        }),
      );
    }
  });

  it("should be able fetch question comments", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value?.comments).toHaveLength(20);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: user.name,
        }),
      ]),
    );
  });

  it("should be able to fetch paginated questions comments", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
