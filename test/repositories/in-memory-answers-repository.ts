import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { InMemoryAnswerAttachmentsRepository } from "./in-memory-answer-attachments-repository";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ) {
    const items = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * perPage, page * perPage);

    return items;
  }

  async create(answer: Answer) {
    this.items.push(answer);

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    );

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
