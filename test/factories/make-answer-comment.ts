import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  IAnswerComment,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAnswerComment(
  override: Partial<IAnswerComment> = {},
  id?: UniqueEntityID,
) {
  const comment = AnswerComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return comment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<IAnswerComment> = {},
  ): Promise<AnswerComment> {
    const comment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}
