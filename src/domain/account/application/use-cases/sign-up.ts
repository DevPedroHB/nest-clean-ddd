import { Either, error, success } from "@/core/either";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { Hasher } from "../cryptography/hasher";
import { UsersRepository } from "../repositories/users-repository";

interface SignUpUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type SignUpUseCaseResponse = Either<
  AlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class SignUpUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return error(new AlreadyExistsError("User with same e-mail"));
    }

    const hashedPassword = await this.hasher.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.create(user);

    return success({
      user,
    });
  }
}
