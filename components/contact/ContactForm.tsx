"use client";

import {
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";

import { Turnstile } from "@marsidev/react-turnstile";

import { ContactSchema } from "@/lib/validation/contact";

import {
    sendContactEmail,
    ContactFormState,
} from "@/app/contact/actions";

import FormFields from "./FormFields";
import SubmitButton from "./SubmitButton";

export default function ContactForm() {

    const formRef = useRef<HTMLFormElement>(null);

    const turnstileRef = useRef<any>(null);

    const nameInputRef = useRef<HTMLInputElement>(null);

    const [isPending, startTransition] = useTransition();

    const [token, setToken] = useState("");

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [serverState, setServerState] =
        useState<ContactFormState>({
            success: false,
            message: "",
        });

    //----------------------------------------------------------
    // Reset after successful submit
    //----------------------------------------------------------

    useEffect(() => {

        if (!serverState.success) return;

        formRef.current?.reset();

        turnstileRef.current?.reset();

        setToken("");

        setErrors({});

        nameInputRef.current?.focus();

    }, [serverState.success]);

    //----------------------------------------------------------
    // Validate one field
    //----------------------------------------------------------

    function validateField(
        field: string,
        value: string,
    ) {

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

    //----------------------------------------------------------
    // Submit
    //----------------------------------------------------------

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        formData.set("turnstileToken", token);

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

                fieldErrors[
                    issue.path[0] as string
                ] = issue.message;

            });

            setErrors(fieldErrors);

            return;
        }

        if (!token) {

            setServerState({

                success: false,

                message:
                    "Please complete the security verification.",

            });

            return;
        }

        setErrors({});

        setServerState({
            success: false,
            message: "",
        });

        startTransition(async () => {

            const response =
                await sendContactEmail(formData);

            setServerState(response);

        });

    }

    //----------------------------------------------------------
    // Render
    //----------------------------------------------------------

    return (

        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            <FormFields
                errors={errors}
                validateField={validateField}
                nameInputRef={nameInputRef}
                disabled={isPending}
            />

            {serverState.message && (

                <div
                    className={`rounded-xl p-4 ${serverState.success
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {serverState.message}
                </div>

            )}

            <Turnstile
                ref={turnstileRef}
                siteKey={
                    process.env
                        .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
                }
                onSuccess={setToken}
                onExpire={() => setToken("")}
                onError={() => setToken("")}
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

            <SubmitButton
                pending={isPending}
                disabled={!token}
            />

        </form>

    );

}