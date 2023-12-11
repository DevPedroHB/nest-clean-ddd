import { SignInUseCase } from "@/domain/account/application/use-cases/sign-in";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { StorageModule } from "../storage/storage.module";
import { SignInController } from "./controllers/account/sign-in.controller";
import { SignUpController } from "./controllers/account/sign-up.controller";
import { AnswerQuestionController } from "./controllers/forum/answer-question.controller";
import { ChooseQuestionBestAnswerController } from "./controllers/forum/choose-question-best-answer.controller";
import { CommentOnAnswerController } from "./controllers/forum/comment-on-answer.controller";
import { CommentOnQuestionController } from "./controllers/forum/comment-on-question.controller";
import { CreateQuestionController } from "./controllers/forum/create-question.controller";
import { DeleteAnswerCommentController } from "./controllers/forum/delete-answer-comment.controller";
import { DeleteAnswerController } from "./controllers/forum/delete-answer.controller";
import { DeleteQuestionCommentController } from "./controllers/forum/delete-question-comment.controller";
import { DeleteQuestionController } from "./controllers/forum/delete-question.controller";
import { EditAnswerController } from "./controllers/forum/edit-answer.controller";
import { EditQuestionController } from "./controllers/forum/edit-question.controller";
import { FetchAnswerCommentsController } from "./controllers/forum/fetch-answer-comments.controller";
import { FetchQuestionAnswersController } from "./controllers/forum/fetch-question-answers.controller";
import { FetchQuestionCommentsController } from "./controllers/forum/fetch-question-comments.controller";
import { FetchRecentQuestionsController } from "./controllers/forum/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/forum/get-question-by-slug.controller";
import { UploadAttachmentController } from "./controllers/forum/upload-attachment.controller";
import { ReadNotificationController } from "./controllers/notification/read-notification.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    SignUpController,
    SignInController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    SignUpUseCase,
    SignInUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
