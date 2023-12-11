import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from "@nestjs/common";

@Controller({ path: "/answers/:id", version: "v1" })
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
