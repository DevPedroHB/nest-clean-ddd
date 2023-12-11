import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Question } from "../../enterprise/entities/question";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionAttachmentList } from "./../../enterprise/entities/question-attachment-list";

interface EditQuestionUseCaseRequest {
  questionId: string;
  title: string;
  content: string;
  authorId: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    title,
    content,
    authorId,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return error(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return error(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(
        question.id.toString(),
      );

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(attachmentId),
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return success({
      question,
    });
  }
}
