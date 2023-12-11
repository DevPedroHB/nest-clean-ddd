import { Either, error, success } from "@/core/either";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encypter";
import { Hasher } from "../cryptography/hasher";
import { UsersRepository } from "../repositories/users-repository";

interface SignInUseCaseRequest {
  email: string;
  password: string;
}

type SignInUseCaseResponse = Either<
  WrongCredentialsError,
  {
    token: string;
  }
>;

@Injectable()
export class SignInUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return error(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hasher.compare(password, user.password);

    if (!isPasswordValid) {
      return error(new WrongCredentialsError());
    }

    const token = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return success({
      token,
    });
  }
}
