import { User } from "@/domain/account/enterprise/entities/user";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { makeUser } from "test/factories/make-user";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;
let user: User;
let answer: Answer;

describe("Fetch answer comments", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryUsersRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
    user = makeUser();
    answer = makeAnswer();

    await inMemoryUsersRepository.create(user);
    await inMemoryAnswersRepository.create(answer);

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
          authorId: user.id,
        }),
      );
    }
  });

  it("should be able fetch answer comments", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
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

  it("should be able to fetch paginated answers comments", async () => {
    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
