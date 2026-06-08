export const emailEndpoints = {
  thmoas: {
    apiKeyEnv: "API_KEY_THMOAS",
    resendApiKeyEnv: "RESEND_API_KEY_THMOAS",
    fromEnv: "FROM_THMOAS",
  },
  "moonsofts-test": {
    apiKeyEnv: "API_KEY_MOONSOFTS_TEST",
    resendApiKeyEnv: "RESEND_API_KEY_MOONSOFTS_TEST",
    fromEnv: "FROM_MOONSOFTS_TEST",
  },
  "moonsofts-prod": {
    apiKeyEnv: "API_KEY_MOONSOFTS_PROD",
    resendApiKeyEnv: "RESEND_API_KEY_MOONSOFTS_PROD",
    fromEnv: "FROM_MOONSOFTS_PROD",
  },
} as const;

export type EmailEndpointId = keyof typeof emailEndpoints;

export function getEndpointConfig(id: EmailEndpointId) {
  const config = emailEndpoints[id];
  return {
    id,
    apiKey: process.env[config.apiKeyEnv],
    resendApiKey: process.env[config.resendApiKeyEnv],
    from: process.env[config.fromEnv],
  };
}
