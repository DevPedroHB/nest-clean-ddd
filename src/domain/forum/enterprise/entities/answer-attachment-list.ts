import { WatchedList } from "@/core/entities/watched-list";
import { AnswerAttachment } from "./answer-attachment";

export interface IAnswerAttachmentList {
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment) {
    return a.attachmentId.equals(b.attachmentId);
  }
}
