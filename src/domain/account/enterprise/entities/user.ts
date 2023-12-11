import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export enum UserRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class User extends Entity<IUser> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  static create(props: Optional<IUser, "role">, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        role: props.role ?? UserRole.STUDENT,
      },
      id,
    );

    return user;
  }
}
