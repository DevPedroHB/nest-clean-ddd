import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.questionId.toString() === questionId)
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

  async create(comment: QuestionComment) {
    this.items.push(comment);
  }

  async save(comment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id);

    this.items[itemIndex] = comment;
  }

  async delete(comment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id);

    this.items.splice(itemIndex, 1);
  }
}
