import { NextRequest } from "next/server";
import type { EmailEndpointId } from "@/lib/endpoints";
import { getEndpointConfig } from "@/lib/endpoints";

function extractApiKey(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return request.headers.get("x-api-key");
}

export function isAuthorizedForEndpoint(
  request: NextRequest,
  endpointId: EmailEndpointId,
): boolean {
  const { apiKey } = getEndpointConfig(endpointId);
  if (!apiKey) return true;

  const provided = extractApiKey(request);
  return provided === apiKey;
}
