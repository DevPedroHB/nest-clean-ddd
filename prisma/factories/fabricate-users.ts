import { Faker } from "@faker-js/faker";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomInt } from "crypto";
import { Factory } from "prisma/seed";

interface IFabricateUser {
  client: PrismaClient;
  faker: Faker;
  factory: Factory;
}

export async function fabricateUser({
  client,
  faker,
  factory,
}: IFabricateUser) {
  const l = 10;

  for (let i = 0; i < randomInt(l, l * 2); i++) {
    const name = faker.person.fullName();
    const passwordHashed = await hash(faker.internet.password(), 8);

    const user = await client.user.create({
      data: {
        name,
        email: faker.internet.email({
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1],
        }),
        password: passwordHashed,
        role: faker.helpers.enumValue(UserRole),
      },
    });

    factory.users.push(user);
  }
}
