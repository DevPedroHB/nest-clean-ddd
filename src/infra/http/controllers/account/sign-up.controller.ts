import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from "@nestjs/common";
import { z } from "zod";

const signUpBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const bodyValidationPipe = new ZodValidationPipe(signUpBodySchema);

type SignUpBodySchema = z.infer<typeof signUpBodySchema>;

@Public()
@Controller({ path: "/sign-up", version: "v1" })
export class SignUpController {
  constructor(private signUp: SignUpUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: SignUpBodySchema) {
    const { name, email, password } = body;

    const result = await this.signUp.execute({
      name,
      email,
      password,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
