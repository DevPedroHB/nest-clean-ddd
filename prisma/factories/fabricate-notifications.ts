import { PrismaClient } from "@prisma/client";
import { Factory } from "prisma/seed";

interface IFabricateNotifications {
  client: PrismaClient;
  factory: Factory;
}

export async function fabricateNotifications({
  client,
  factory,
}: IFabricateNotifications) {
  for (const question of factory.questions) {
    const answers = factory.answers.filter(
      (answer) => answer.questionId === question.id,
    );

    for (const answer of answers) {
      const notification = await client.notification.create({
        data: {
          title: `Nova resposta em "${question.title
            .substring(0, 40)
            .concat("...")}"`,
          content: answer.content.substring(0, 120).trimEnd().concat("..."),
          recipientId: question.authorId,
        },
      });

      factory.notifications.push(notification);
    }
  }
}
