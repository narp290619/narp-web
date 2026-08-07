"use client";

import {
    useActionState,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    sendContactEmail,
    ContactFormState,
} from "@/app/contact/actions";

import { ContactSchema } from "@/lib/validation/contact";

import SubmitButton from "./SubmitButton";
import FormFields from "./FormFields";
import { Turnstile } from "@marsidev/react-turnstile";

const initialState: ContactFormState = {
    success: false,
    message: "",
};

export default function ContactForm() {

    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction] = useActionState(
        sendContactEmail,
        initialState,
    );

    const turnstileRef = useRef<any>(null);

    const nameInputRef = useRef<HTMLInputElement | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [token, setToken] = useState("");

    useEffect(() => {

        if (state.success) {

            formRef.current?.reset();

            turnstileRef.current?.reset();

            setToken("");

            setErrors({});

            nameInputRef.current?.focus();

        }

    }, [state.success]);

    function validateField(field: string, value: string) {

        const values = {
            name: "",
            email: "",
            subject: "",
            message: "",
        };

        values[field as keyof typeof values] = value;

        const result = ContactSchema.pick({
            [field]: true,
        } as any).safeParse({
            [field]: value,
        });

        setErrors((prev) => ({

            ...prev,

            [field]: result.success
                ? ""
                : result.error.issues[0]?.message,

        }));
    }

    function validateAndSubmit(formData: FormData) {

        const values = {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            subject: String(formData.get("subject") ?? ""),
            message: String(formData.get("message") ?? ""),
        };

        const result = ContactSchema.safeParse(values);

        if (!result.success) {

            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {

                const field = issue.path[0] as string;

                fieldErrors[field] = issue.message;

            });

            setErrors(fieldErrors);

            return;
        }

        setErrors({});

        formAction(formData);
    }

    return (

        <form
            ref={formRef}
            action={validateAndSubmit}
            className="space-y-6"
        >

            <FormFields />

            {/* Server Message */}

            {state.message && (

                <div
                    className={`rounded-xl p-4 ${state.success
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {state.message}
                </div>

            )}

            <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setToken}
                onExpire={() => setToken("")}
                onError={() => setToken("")}
                onWidgetLoad={() => {
                    console.log("Turnstile loaded");
                }}
                options={{
                    refreshExpired: "auto",
                    refreshTimeout: "auto",
                }}
            />

            <input
                type="hidden"
                name="turnstileToken"
                value={token}
            />

            <SubmitButton disabled={!token} />

        </form>

    );
}