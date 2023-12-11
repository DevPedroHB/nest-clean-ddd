import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateAnswers {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateAnswers({
  client,
  faker,
  factory,
}: IFabricateAnswers) {
  const l = factory.questions.length;
  const instructors = factory.users.filter(
    (user) => user.role === "INSTRUCTOR",
  );

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const answer = await client.answer.create({
      data: {
        content: faker.lorem.text(),
        authorId: faker.helpers.arrayElement(instructors).id,
        questionId: faker.helpers.arrayElement(factory.questions).id,
      },
    });

    factory.answers.push(answer);
  }
}
