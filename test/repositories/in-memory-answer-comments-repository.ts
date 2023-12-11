import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyByAnswerId(
    answerId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * perPage, page * perPage)
      .map((comment) => {
        const author = this.usersRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error(
            `Author with id "${comment.authorId.toString()}" does not exists.`,
          );
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        });
      });

    return items;
  }

  async create(comment: AnswerComment) {
    this.items.push(comment);
  }

  async save(comment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id);

    this.items[itemIndex] = comment;
  }

  async delete(comment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id);

    this.items.splice(itemIndex, 1);
  }
}
