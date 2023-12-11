import { Encrypter } from "@/domain/account/application/cryptography/encypter";

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
  }
}
