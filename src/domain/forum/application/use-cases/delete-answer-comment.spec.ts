import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let comment: AnswerComment;

describe("Delete answer comment", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryUsersRepository,
    );
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
    comment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(comment);
  });

  it("should be able to delete a answer comment", async () => {
    const result = await sut.execute({
      authorId: comment.authorId.toString(),
      commentId: comment.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer comment from another user", async () => {
    const result = await sut.execute({
      authorId: "other-author-id",
      commentId: comment.id.toString(),
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
