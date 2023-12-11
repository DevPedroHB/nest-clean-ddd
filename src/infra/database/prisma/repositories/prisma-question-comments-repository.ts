import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "./../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(comment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return comments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page, perPage }: PaginationParams,
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return comments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(comment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPrisma(comment);

    await this.prisma.comment.create({
      data,
    });
  }

  async save(comment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPrisma(comment);

    await Promise.all([
      this.prisma.comment.update({
        where: {
          id: data.id,
        },
        data,
      }),
    ]);
  }

  async delete(comment: QuestionComment) {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
}
