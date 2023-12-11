import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateComments {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateComments({
  client,
  faker,
  factory,
}: IFabricateComments) {
  const l = factory.answers.length;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const commentOn = faker.helpers.arrayElement(["question", "answer"]);
    const content = faker.lorem.text();
    const authorId = faker.helpers.arrayElement(factory.users).id;
    let comment: (typeof factory.comments)[0];

    if (commentOn === "question") {
      comment = await client.comment.create({
        data: {
          content,
          authorId,
          questionId: faker.helpers.arrayElement(factory.questions).id,
        },
      });
    } else {
      comment = await client.comment.create({
        data: {
          content,
          authorId,
          answerId: faker.helpers.arrayElement(factory.answers).id,
        },
      });
    }

    factory.comments.push(comment);
  }
}
