import { Encrypter } from "@/domain/account/application/cryptography/encypter";
import { Hasher } from "@/domain/account/application/cryptography/hasher";
import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: Hasher, useClass: BcryptHasher },
  ],
  exports: [Encrypter, Hasher],
})
export class CryptographyModule {}
