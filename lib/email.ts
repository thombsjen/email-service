import { Resend } from "resend";
import type { EmailEndpointId } from "@/lib/endpoints";
import { getEndpointConfig } from "@/lib/endpoints";

const clients = new Map<string, Resend>();

function getResendClient(endpointId: EmailEndpointId): Resend {
  const { resendApiKey } = getEndpointConfig(endpointId);
  if (!resendApiKey) {
    throw new Error(`Resend API key for ${endpointId} must be set`);
  }

  if (!clients.has(resendApiKey)) {
    clients.set(resendApiKey, new Resend(resendApiKey));
  }

  return clients.get(resendApiKey)!;
}

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail(
  endpointId: EmailEndpointId,
  input: SendEmailInput,
) {
  const { from: defaultFrom } = getEndpointConfig(endpointId);
  const from = input.from ?? defaultFrom;
  if (!from) {
    throw new Error(
      `Default from address for ${endpointId} must be set or provide a from address`,
    );
  }

  if (!input.text && !input.html) {
    throw new Error("Either text or html body is required");
  }

  const resend = getResendClient(endpointId);
  const base = {
    from,
    to: input.to,
    subject: input.subject,
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
  };

  const { data, error } = input.html
    ? await resend.emails.send({
        ...base,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
      })
    : await resend.emails.send({ ...base, text: input.text! });

  if (error) {
    throw new Error(error.message);
  }

  return { id: data?.id };
}
