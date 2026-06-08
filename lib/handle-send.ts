import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedForEndpoint } from "@/lib/auth";
import { handleCorsPreflightRequest, withCors } from "@/lib/cors";
import type { EmailEndpointId } from "@/lib/endpoints";
import { sendEmail } from "@/lib/email";
import { sendEmailSchema } from "@/lib/validation";

export function createSendHandler(endpointId: EmailEndpointId) {
  async function OPTIONS(request: NextRequest) {
    return (
      handleCorsPreflightRequest(request) ??
      new NextResponse(null, { status: 405 })
    );
  }

  async function POST(request: NextRequest) {
    if (!isAuthorizedForEndpoint(request, endpointId)) {
      return withCors(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        request,
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return withCors(
        NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
        request,
      );
    }

    const parsed = sendEmailSchema.safeParse(body);
    if (!parsed.success) {
      return withCors(
        NextResponse.json(
          { error: "Validation failed", details: parsed.error.flatten() },
          { status: 400 },
        ),
        request,
      );
    }

    try {
      const result = await sendEmail(endpointId, parsed.data);
      return withCors(
        NextResponse.json({ ok: true, ...result }),
        request,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send email";
      const status = message.includes("must be set") ? 503 : 500;
      return withCors(
        NextResponse.json({ error: message }, { status }),
        request,
      );
    }
  }

  return { POST, OPTIONS };
}
