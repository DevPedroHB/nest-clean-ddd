import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Comment, IComment } from "./comment";

export interface IQuestionComment extends IComment {
  questionId: UniqueEntityID;
}

export class QuestionComment extends Comment<IQuestionComment> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<IQuestionComment, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return questionComment;
  }
}
