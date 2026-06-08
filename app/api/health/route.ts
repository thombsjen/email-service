import { NextResponse } from "next/server";
import { emailEndpoints } from "@/lib/endpoints";

export async function GET() {
  const endpoints = Object.fromEntries(
    Object.entries(emailEndpoints).map(([id, config]) => [
      id,
      {
        resendConfigured: Boolean(process.env[config.resendApiKeyEnv]),
        fromConfigured: Boolean(process.env[config.fromEnv]),
        authRequired: Boolean(process.env[config.apiKeyEnv]),
      },
    ]),
  );

  return NextResponse.json({
    status: "ok",
    provider: "resend",
    endpoints,
  });
}
