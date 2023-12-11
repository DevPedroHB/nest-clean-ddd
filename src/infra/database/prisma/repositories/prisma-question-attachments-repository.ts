import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string) {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map((attachment) =>
      attachment.id.toString(),
    );

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
