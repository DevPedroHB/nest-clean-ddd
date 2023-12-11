import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { Question } from "../../enterprise/entities/question";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditQuestionUseCase;
let question: Question;

describe("Edit question", () => {
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
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
    question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    for (let i = 0; i < 2; i++) {
      inMemoryQuestionAttachmentsRepository.items.push(
        makeQuestionAttachment({
          questionId: question.id,
        }),
      );
    }
  });

  it("should be able to edit a question", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      title: "New title",
      content: "New content",
      authorId: question.authorId.toString(),
      attachmentsIds: ["0", "1"],
    });

    expect(result.isSuccess()).toBe(true);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("0") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
    ]);
  });

  it("should not be able to edit a question from another user", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      title: "New title",
      content: "New content",
      authorId: "other-author-id",
      attachmentsIds: [],
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should sync new and removed attachments when editing a question", async () => {
    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      title: "New title",
      content: "New content",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
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
