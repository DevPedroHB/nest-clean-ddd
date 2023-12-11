import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Attachment } from "../attachment";
import { Slug } from "./slug";

export interface IQuestionDetails {
  attachments: Attachment[];
  author: string;
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID | null;
  content: string;
  createdAt: Date;
  questionId: UniqueEntityID;
  slug: Slug;
  title: string;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<IQuestionDetails> {
  get attachments() {
    return this.props.attachments;
  }

  get author() {
    return this.props.author;
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get questionId() {
    return this.props.questionId;
  }

  get slug() {
    return this.props.slug;
  }

  get title() {
    return this.props.title;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: IQuestionDetails) {
    return new QuestionDetails(props);
  }
}
