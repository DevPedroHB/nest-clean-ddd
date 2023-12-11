import { Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateAttachments {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateAttachments({
  client,
  faker,
  factory,
}: IFabricateAttachments) {
  const l = factory.answers.length;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const attachmentOn = faker.helpers.arrayElement(["question", "answer"]);
    const title = faker.lorem.sentence();
    const url = faker.image.url();
    let attachment: (typeof factory.attachments)[0];

    if (attachmentOn === "question") {
      attachment = await client.attachment.create({
        data: {
          title,
          url,
          questionId: faker.helpers.arrayElement(factory.questions).id,
        },
      });
    } else {
      attachment = await client.attachment.create({
        data: {
          title,
          url,
          answerId: faker.helpers.arrayElement(factory.answers).id,
        },
      });
    }

    factory.attachments.push(attachment);
  }
}
