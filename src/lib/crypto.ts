import { publicKeyApi } from "../api/publickey";

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");

  const binary = Uint8Array.from([...base64].map((char) => char.charCodeAt(0)));

  const decoded = self.crypto.subtle
    ? Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    : binary;

  return decoded.buffer;
}

export async function encryptData(data: string): Promise<string> {
  const publicKey = await publicKeyApi.getPublicKey();
  if (!publicKey || !publicKey.success) {
    throw new Error(`Public key not available.`);
  }
  const binaryDer = pemToArrayBuffer(publicKey.data!);

  const cryptoKey = await crypto.subtle.importKey(
    "spki",
    binaryDer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const combined = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    cryptoKey,
    encoded
  );
  if (!combined) throw new Error(`Encryption failed.`);
  return btoa(String.fromCharCode(...new Uint8Array(combined)));
}
