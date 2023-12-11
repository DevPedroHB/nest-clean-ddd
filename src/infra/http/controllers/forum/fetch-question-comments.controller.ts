import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { CommentWithAuthorPresenter } from "../../presenters/comment-with-author-presenter";

const pageQuerySchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema);

type PageQuerySchema = z.infer<typeof pageQuerySchema>;

@Controller({ path: "/comments/:questionId/questions", version: "v1" })
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQuerySchema,
    @Param("questionId") questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      perPage: 20,
      questionId,
    });

    if (result.isError()) {
      throw new BadRequestException();
    }

    return {
      comments: result.value.comments.map(CommentWithAuthorPresenter.toHTTP),
    };
  }
}
