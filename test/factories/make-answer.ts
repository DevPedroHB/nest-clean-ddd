import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, IAnswer } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAnswer(
  override: Partial<IAnswer> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<IAnswer> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
