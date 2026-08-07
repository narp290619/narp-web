"use server";

import { ContactSchema } from "@/lib/validation/contact";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
    success: boolean;
    message: string;
};

export async function sendContactEmail(
    prevState: ContactFormState,
    formData: FormData,
): Promise<ContactFormState> {

    try {

        //---------------------------------
        // Validate Form
        //---------------------------------

        const parsed = ContactSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        });

        if (!parsed.success) {
            return {
                success: false,
                message:
                    parsed.error.issues[0]?.message ??
                    "Please check the form.",
            };
        }

        const { name, email, subject, message } = parsed.data;

        //---------------------------------
        // Verify Cloudflare Turnstile
        //---------------------------------

        const turnstileToken = String(
            formData.get("turnstileToken") ?? ""
        );

        if (!turnstileToken) {
            return {
                success: false,
                message: "Please complete the security verification.",
            };
        }

        const forwarded = (await headers()).get("x-forwarded-for") ?? "";

        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },

                body: new URLSearchParams({
                    secret: process.env.TURNSTILE_SECRET_KEY!,
                    response: turnstileToken,
                    remoteip: forwarded.split(",")[0].trim(),
                }),
            }
        );

        const result = await response.json();

        const allowedHosts = [
            "narp-svc.site",
            "www.narp-svc.site",
        ];

        if (
            !result.success ||
            !allowedHosts.includes(result.hostname)
        ) {
            return {
                success: false,
                message: "Security verification failed. Please try again.",
            };
        }

        //---------------------------------
        // Send Email
        //---------------------------------

        await resend.emails.send({

            from: "NARP Website <support@narp-svc.site>",

            to: process.env.CONTACT_EMAIL!,

            replyTo: email,

            subject: `[Contact] ${subject}`,

            html: `
                <h2>New Contact Form Submission</h2>

                <hr/>

                <p><strong>Name</strong></p>
                <p>${name}</p>

                <p><strong>Email</strong></p>
                <p>${email}</p>

                <p><strong>Subject</strong></p>
                <p>${subject}</p>

                <p><strong>Message</strong></p>

                <p style="white-space: pre-line;">
                    ${message}
                </p>

                <hr/>

                <p>
                    Submitted from narp-svc.site
                </p>
            `,
        });

        return {
            success: true,
            message:
                "Thank you! We've received your message and will respond within 1–2 business days.",
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message:
                "Unable to send your message right now. Please try again later.",
        };
    }
}