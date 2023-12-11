import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const items = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return items;
  }

  async createMany(attachments: QuestionAttachment[]) {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    const newItems = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = newItems;
  }

  async deleteManyByQuestionId(questionId: string) {
    const newItems = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = newItems;
  }
}
