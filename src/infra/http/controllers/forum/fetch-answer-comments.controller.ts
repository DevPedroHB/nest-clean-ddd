import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
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

@Controller({ path: "/comments/:answerId/answers", version: "v1" })
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQuerySchema,
    @Param("answerId") answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      perPage: 20,
      answerId,
    });

    if (result.isError()) {
      throw new BadRequestException();
    }

    return {
      comments: result.value.comments.map(CommentWithAuthorPresenter.toHTTP),
    };
  }
}
