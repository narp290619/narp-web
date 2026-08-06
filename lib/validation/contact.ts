import { z } from "zod";

export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters.")
    .max(120, "Subject is too long."),

  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(3000, "Message is too long."),
});

export type ContactFormData = z.infer<typeof ContactSchema>;