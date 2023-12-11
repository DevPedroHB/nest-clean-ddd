import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { SignUpUseCase } from "./sign-up";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: SignUpUseCase;

describe("Sign up", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new SignUpUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to sign up", async () => {
    const result = await sut.execute({
      name: "An example name",
      email: "example@example.com",
      password: "123456",
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it("should hash user password upon sign up", async () => {
    const result = await sut.execute({
      name: "An example name",
      email: "example@example.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
