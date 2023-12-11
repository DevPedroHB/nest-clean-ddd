import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { AnswerPresenter } from "../../presenters/answer-presenter";

const pageQuerySchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema);

type PageQuerySchema = z.infer<typeof pageQuerySchema>;

@Controller({ path: "/answers/:questionId", version: "v1" })
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQuerySchema,
    @Param("questionId") questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      perPage: 20,
      questionId,
    });

    if (result.isError()) {
      throw new BadRequestException();
    }

    return {
      answers: result.value.answers.map(AnswerPresenter.toHTTP),
    };
  }
}
