import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  if (request.method === "OPTIONS") {
    if (!headers) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
