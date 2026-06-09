import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "https://moonsofts.net",
  "https://www.moonsofts.net",
  "http://localhost:5173",
  "https://thomas-portfolio-snowy.vercel.app/"
]);

export function isAllowedOrigin(origin: string | null): origin is string {
  return origin !== null && ALLOWED_ORIGINS.has(origin);
}

export function corsHeaders(origin: string | null): HeadersInit | null {
  if (!isAllowedOrigin(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Api-Key",
    "Access-Control-Max-Age": "86400",
  };
}

export function withCors(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  const headers = corsHeaders(request.headers.get("origin"));
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
  }
  return response;
}

export function handleCorsPreflightRequest(
  request: NextRequest,
): NextResponse | null {
  if (request.method !== "OPTIONS") {
    return null;
  }

  const headers = corsHeaders(request.headers.get("origin"));
  if (!headers) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, { status: 204, headers });
}
