import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { QuestionDetailsPresenter } from "../../presenters/question-details-presenter";

@Controller({ path: "/questions/:slug", version: "v1" })
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      question: QuestionDetailsPresenter.toHTTP(result.value.question),
    };
  }
}
