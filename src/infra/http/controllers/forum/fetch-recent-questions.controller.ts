import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { QuestionPresenter } from "../../presenters/question-presenter";

const pageQuerySchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema);

type PageQuerySchema = z.infer<typeof pageQuerySchema>;

@Controller({ path: "/questions", version: "v1" })
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQuerySchema) {
    const result = await this.fetchRecentQuestions.execute({
      page,
      perPage: 20,
    });

    if (result.isError()) {
      throw new BadRequestException();
    }

    return {
      questions: result.value.questions.map(QuestionPresenter.toHTTP),
    };
  }
}
