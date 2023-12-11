import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteQuestionCommentUseCase;
let comment: QuestionComment;

describe("Delete question comment", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryUsersRepository,
    );
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
    comment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(comment);
  });

  it("should be able to delete a question comment", async () => {
    const result = await sut.execute({
      authorId: comment.authorId.toString(),
      commentId: comment.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question comment from another user", async () => {
    const result = await sut.execute({
      authorId: "other-author-id",
      commentId: comment.id.toString(),
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
