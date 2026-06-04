import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "email-service",
    endpoints: {
      health: "GET /api/health",
      send: "POST /api/send",
    },
  });
}
