import { faker } from "@faker-js/faker";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch recent questions", () => {
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
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: faker.date.recent({
            days: 7,
          }),
        }),
      );
    }
  });

  it("should be able to fetch recent questions", async () => {
    const result = await sut.execute({
      page: 1,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    for (let i = 0; i < result.value!.questions.length - 1; i++) {
      expect(
        result.value?.questions[i].createdAt.getTime(),
      ).toBeGreaterThanOrEqual(
        result.value!.questions[i + 1].createdAt.getTime(),
      );
    }
  });

  it("should be able to fetch paginated recent questions", async () => {
    const result = await sut.execute({
      page: 2,
      perPage: 20,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value?.questions).toHaveLength(2);
  });
});
