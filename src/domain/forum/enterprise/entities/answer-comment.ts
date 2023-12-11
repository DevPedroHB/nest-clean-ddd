import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Comment, IComment } from "./comment";

export interface IAnswerComment extends IComment {
  answerId: UniqueEntityID;
}

export class AnswerComment extends Comment<IAnswerComment> {
  get answerId() {
    return this.props.answerId;
  }

  static create(
    props: Optional<IAnswerComment, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return answerComment;
  }
}
