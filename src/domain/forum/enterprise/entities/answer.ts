import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { AnswerCreatedEvent } from "../events/answer-created-event";
import { AnswerAttachmentList } from "./answer-attachment-list";

export interface IAnswer {
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
}

export class Answer extends AggregateRoot<IAnswer> {
  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;

    this.touch();
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<IAnswer, "createdAt" | "attachments">,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    if (!id) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
