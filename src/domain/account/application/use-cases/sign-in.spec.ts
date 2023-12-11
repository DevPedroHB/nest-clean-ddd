import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { SignInUseCase } from "./sign-in";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: SignInUseCase;

describe("Sign in", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new SignInUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter);
  });

  it("should be able to sign in", async () => {
    const user = makeUser({
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      email: user.email,
      password: "123456",
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      token: expect.any(String),
    });
  });
});
