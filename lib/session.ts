// Session token management (HMAC-SHA256).
// Uses Web Crypto only so it works in the proxy Node.js runtime.
// Format token: "base64url(payload JSON).base64url(signature)"

export const SESSION_COOKIE = "admin_session";
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

export type SessionPayload = {
  userId: string;
  exp: number;
};

function getSecret(): string {
  return process.env.SESSION_SECRET || "dev-session-secret-change-me";
}

function base64urlEncode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(b64)));
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return base64urlEncode(String.fromCharCode(...new Uint8Array(sig)));
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

export async function createSessionToken(userId: string): Promise<string> {
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const sig = await hmacSign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function decodeSessionPayload(token: string): SessionPayload | null {
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;
  try {
    const payload = JSON.parse(base64urlDecode(payloadB64)) as SessionPayload;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp < Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;
  const payload = decodeSessionPayload(token);
  if (!payload) return false;
  const expected = await hmacSign(payloadB64);
  return timingSafeEqualStrings(expected, sigB64);
}
