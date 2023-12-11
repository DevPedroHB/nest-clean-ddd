import { Hasher } from "@/domain/account/application/cryptography/hasher";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher implements Hasher {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string) {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string) {
    return await compare(plain, hash);
  }
}
