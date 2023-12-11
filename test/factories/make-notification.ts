import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  INotification,
  Notification,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeNotification(
  override: Partial<INotification> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return notification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<INotification> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
