import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeNotification } from "test/factories/make-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { Notification } from "../../enterprise/entities/notification";
import { ReadNotificationUseCase } from "./read-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;
let notification: Notification;

describe("Read notification", () => {
  beforeEach(async () => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
    notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);
  });

  it("should be able to read a notification", async () => {
    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it("should not be able to read a notification from another user", async () => {
    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: "other-recipient-id",
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
