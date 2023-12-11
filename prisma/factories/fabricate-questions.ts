import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateQuestions {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateQuestions({
  client,
  faker,
  factory,
}: IFabricateQuestions) {
  const l = factory.users.length;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const students = factory.users.filter((user) => user.role === "STUDENT");
    const title = faker.lorem.sentence();

    const question = await client.question.create({
      data: {
        title,
        slug: faker.helpers.slugify(title).toLowerCase().replace(".", ""),
        content: faker.lorem.text(),
        authorId: faker.helpers.arrayElement(students).id,
      },
    });

    factory.questions.push(question);
  }
}
