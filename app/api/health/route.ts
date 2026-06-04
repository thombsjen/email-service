import { NextResponse } from "next/server";

export async function GET() {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );

  return NextResponse.json({
    status: "ok",
    smtpConfigured,
    authRequired: Boolean(process.env.API_KEY),
  });
}
