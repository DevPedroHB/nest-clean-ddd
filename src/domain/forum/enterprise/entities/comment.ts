import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface IComment {
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
  authorId: UniqueEntityID;
}

export abstract class Comment<T extends IComment> extends Entity<T> {
  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;

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

  private touch() {
    this.props.updatedAt = new Date();
  }
}
