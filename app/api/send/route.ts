import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { sendEmailSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sendEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await sendEmail(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    const status = message.includes("must be set") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
