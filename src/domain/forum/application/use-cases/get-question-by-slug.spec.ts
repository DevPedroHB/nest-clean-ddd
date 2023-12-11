import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { makeUser } from "test/factories/make-user";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const user = makeUser();
    const question = makeQuestion({
      authorId: user.id,
    });
    const attachment = makeAttachment();

    await inMemoryUsersRepository.create(user);
    await inMemoryQuestionsRepository.create(question);
    await inMemoryAttachmentsRepository.create(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      }),
    );

    const result = await sut.execute({
      slug: question.slug.value,
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: question.title,
        author: user.name,
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    });
  });
});
