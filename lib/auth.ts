import { NextRequest } from "next/server";

export function isAuthorized(request: NextRequest): boolean {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return true;

  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7) === apiKey;
  }

  const keyHeader = request.headers.get("x-api-key");
  return keyHeader === apiKey;
}
