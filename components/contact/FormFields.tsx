"use client";

import { RefObject } from "react";

type Props = {
    errors: Record<string, string>;
    disabled: boolean;
    validateField: (
        field: string,
        value: string,
    ) => void;
    nameInputRef: RefObject<HTMLInputElement | null>;
};

export default function FormFields({
    errors,
    disabled,
    validateField,
    nameInputRef,
}: Props) {

    return (

        <>

            {/* Name */}

            <div>

                <label className="mb-2 block font-medium">
                    Name
                </label>

                <input
                    ref={nameInputRef}
                    name="name"
                    type="text"
                    disabled={disabled}
                    className={`
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        transition
                        focus:border-orange-500
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                        ${errors.name
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                    `}
                    onChange={(e) =>
                        validateField(
                            "name",
                            e.target.value,
                        )
                    }
                />

                {errors.name && (

                    <p className="mt-2 text-sm text-red-600">
                        {errors.name}
                    </p>

                )}

            </div>

            {/* Email */}

            <div>

                <label className="mb-2 block font-medium">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    disabled={disabled}
                    className={`
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        transition
                        focus:border-orange-500
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                        ${errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                    `}
                    onChange={(e) =>
                        validateField(
                            "email",
                            e.target.value,
                        )
                    }
                />

                {errors.email && (

                    <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                    </p>

                )}

            </div>

            {/* Subject */}

            <div>

                <label className="mb-2 block font-medium">
                    Subject
                </label>

                <input
                    type="text"
                    name="subject"
                    disabled={disabled}
                    className={`
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        transition
                        focus:border-orange-500
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                        ${errors.subject
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                    `}
                    onChange={(e) =>
                        validateField(
                            "subject",
                            e.target.value,
                        )
                    }
                />

                {errors.subject && (

                    <p className="mt-2 text-sm text-red-600">
                        {errors.subject}
                    </p>

                )}

            </div>

            {/* Message */}

            <div>

                <label className="mb-2 block font-medium">
                    Message
                </label>

                <textarea
                    rows={6}
                    name="message"
                    disabled={disabled}
                    className={`
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        transition
                        focus:border-orange-500
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                        ${errors.message
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                    `}
                    onChange={(e) =>
                        validateField(
                            "message",
                            e.target.value,
                        )
                    }
                />

                {errors.message && (

                    <p className="mt-2 text-sm text-red-600">
                        {errors.message}
                    </p>

                )}

            </div>

        </>

    );

}