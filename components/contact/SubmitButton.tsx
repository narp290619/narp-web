"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
    disabled?: boolean;
};

export default function SubmitButton({
    disabled = false,
}: SubmitButtonProps) {

    const { pending } = useFormStatus();

    return (

        <button
            type="submit"
            disabled={pending || disabled}
            className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-orange-500
                px-6
                py-4
                font-semibold
                text-white
                transition
                hover:bg-orange-600
                disabled:cursor-not-allowed
                disabled:opacity-70
            "
        >

            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                </>
            ) : disabled ? (
                "Complete Security Check"
            ) : (
                "Send Message"
            )}

        </button>

    );
}