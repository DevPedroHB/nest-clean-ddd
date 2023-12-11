import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "./../mappers/prisma-answer-comment-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
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

    return PrismaAnswerCommentMapper.toDomain(comment);
  }

  async findManyByAnswerId(
    answerId: string,
    { page, perPage }: PaginationParams,
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return comments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page, perPage }: PaginationParams,
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
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

  async create(comment: AnswerComment) {
    const data = PrismaAnswerCommentMapper.toPrisma(comment);

    await this.prisma.comment.create({
      data,
    });
  }

  async save(comment: AnswerComment) {
    const data = PrismaAnswerCommentMapper.toPrisma(comment);

    await Promise.all([
      this.prisma.comment.update({
        where: {
          id: data.id,
        },
        data,
      }),
    ]);
  }

  async delete(comment: AnswerComment) {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
}
