"use server";

import { ContactSchema } from "@/lib/validation/contact";
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

                <p style="white-space:pre-line;">
                    ${message}
                </p>

                <hr/>

                <p>
                    Submitted from
                    narp-svc.site
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