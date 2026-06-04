import { z } from "zod";

const email = z.string().email();

export const sendEmailSchema = z
  .object({
    to: z.union([email, z.array(email).min(1)]),
    subject: z.string().min(1).max(998),
    text: z.string().optional(),
    html: z.string().optional(),
    from: email.optional(),
    replyTo: email.optional(),
  })
  .refine((data) => data.text || data.html, {
    message: "Either text or html is required",
    path: ["text"],
  });

export type SendEmailBody = z.infer<typeof sendEmailSchema>;
