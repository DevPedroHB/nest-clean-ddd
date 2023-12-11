import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  IQuestionComment,
  QuestionComment,
} from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeQuestionComment(
  override: Partial<IQuestionComment> = {},
  id?: UniqueEntityID,
) {
  const comment = QuestionComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return comment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<IQuestionComment> = {},
  ): Promise<QuestionComment> {
    const comment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}
