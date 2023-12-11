import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { User } from "@/domain/account/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const item = this.items.find((item) => item.email === email);

    if (!item) {
      return null;
    }

    return item;
  }

  async create(user: User) {
    this.items.push(user);
  }
}
