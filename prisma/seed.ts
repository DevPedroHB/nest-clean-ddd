import { Faker, en, pt_BR } from "@faker-js/faker";
import {
  Answer,
  Attachment,
  Comment,
  Notification,
  PrismaClient,
  Question,
  User,
} from "@prisma/client";
import { fabricateAnswers } from "./factories/fabricate-answers";
import { fabricateAttachments } from "./factories/fabricate-attachments";
import { fabricateComments } from "./factories/fabricate-comments";
import { fabricateNotifications } from "./factories/fabricate-notifications";
import { fabricateQuestions } from "./factories/fabricate-questions";
import { fabricateUser } from "./factories/fabricate-users";

const client = new PrismaClient();
const faker = new Faker({
  locale: [pt_BR, en],
});

export type Factory = {
  users: User[];
  questions: Question[];
  answers: Answer[];
  comments: Comment[];
  attachments: Attachment[];
  notifications: Notification[];
};

interface Tabela {
  tablename: string;
}

async function run() {
  const factory: Factory = {
    users: [],
    questions: [],
    answers: [],
    comments: [],
    attachments: [],
    notifications: [],
  };
  const tabelas: Tabela[] = await client.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

  for (const tabela of tabelas) {
    await client.$queryRawUnsafe(`
      TRUNCATE TABLE "${tabela.tablename}" RESTART IDENTITY CASCADE;
    `);
  }

  await fabricateUser({ client, faker, factory });
  await fabricateQuestions({ client, faker, factory });
  await fabricateAnswers({ client, faker, factory });
  await fabricateComments({ client, faker, factory });
  await fabricateAttachments({ client, faker, factory });
  await fabricateNotifications({ client, factory });
}

run()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await client.$disconnect();

    process.exit(1);
  });
