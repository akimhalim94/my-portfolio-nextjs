import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Hash password with scrypt (random salt per user).
// Storage format: "salt:hash" in hex.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const testHash = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (testHash.length !== expected.length) return false;
  return timingSafeEqual(testHash, expected);
}
