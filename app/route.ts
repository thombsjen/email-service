import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "email-service",
    provider: "resend",
    endpoints: {
      health: "GET /api/health",
      thmoas: "POST /api/send/thmoas",
      moonsoftsTest: "POST /api/send/moonsofts-test",
      moonsoftsProd: "POST /api/send/moonsofts-prod",
    },
  });
}
