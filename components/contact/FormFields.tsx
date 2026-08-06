"use client";

import { useFormStatus } from "react-dom";

export default function FormFields() {
    const { pending } = useFormStatus();

    return (
        <fieldset
            disabled={pending}
            className={pending ? "space-y-6 opacity-60" : "space-y-6"}
        >
            <div>
                <label className="mb-2 block font-medium">
                    Name
                </label>

                <input
                    name="name"
                    className="
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        focus:border-orange-500
                    "
                />
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    className="
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        focus:border-orange-500
                    "
                />
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Subject
                </label>

                <input
                    name="subject"
                    className="
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        focus:border-orange-500
                    "
                />
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Message
                </label>

                <textarea
                    rows={6}
                    name="message"
                    className="
                        w-full
                        rounded-xl
                        border
                        p-4
                        outline-none
                        focus:border-orange-500
                    "
                />
            </div>
        </fieldset>
    );
}