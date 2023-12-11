import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";
import { QuestionAttachmentList } from "./question-attachment-list";
import { Slug } from "./value-objects/slug";

export interface IQuestion {
  title: string;
  content: string;
  slug: Slug;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
  bestAnswerId?: UniqueEntityID | null;
  authorId: UniqueEntityID;
}

export class Question extends AggregateRoot<IQuestion> {
  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;

    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }

    this.props.bestAnswerId = bestAnswerId;

    this.touch();
  }

  get authorId() {
    return this.props.authorId;
  }

  get isNew() {
    return dayjs().diff(this.props.createdAt, "days") <= 3;
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<IQuestion, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }
}
