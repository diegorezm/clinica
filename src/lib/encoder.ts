// from: https://dev.to/vapourisation/east-encryption-in-typescript-3948
import * as crypto from "node:crypto";
import { HASH_KEY } from "@/env";
function splitEncryptedText(encryptedText: string) {
  return {
    ivString: encryptedText.slice(0, 32),
    encryptedDataString: encryptedText.slice(32),
  };
}

class Encoder {
  private encoding: BufferEncoding = "hex";

  encrypt(plaintext: string) {
    try {
      const iv = crypto.randomBytes(16);
      const key = crypto.createHash("sha256").update(HASH_KEY).digest();
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf-8"),
        cipher.final(),
      ]);

      return iv.toString(this.encoding) + encrypted.toString(this.encoding);
    } catch (e) {
      console.error(e);
    }
  }

  decrypt(cipherText: string) {
    const { encryptedDataString, ivString } = splitEncryptedText(cipherText);

    try {
      const iv = Buffer.from(ivString, this.encoding);
      const encryptedText = Buffer.from(encryptedDataString, this.encoding);
      const key = crypto.createHash("sha256").update(HASH_KEY).digest();
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

      const decrypted = decipher.update(encryptedText);
      return Buffer.concat([decrypted, decipher.final()]).toString();
    } catch (e) {
      console.error(e);
    }
  }
}

const encoder = new Encoder();
export default encoder;
