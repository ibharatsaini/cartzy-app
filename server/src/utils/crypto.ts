import { Buffer } from "buffer";
import crypto from "crypto";

export function decryptData(encryptedData: string): string {
  const privateKey = process.env.PRIVATE_KEY!;
  const encryptedBuffer = Buffer.from(encryptedData, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedBuffer
  );

  return decrypted.toString();
}
