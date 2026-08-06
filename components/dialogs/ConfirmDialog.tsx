"use client";

interface ConfirmDialogProps {

    open: boolean;

    title: string;

    message: string;

    confirmText?: string;

    cancelText?: string;

    loading?: boolean;

    onConfirm: () => void;

    onCancel: () => void;

}

export default function ConfirmDialog({

    open,

    title,

    message,

    confirmText = "Confirm",

    cancelText = "Cancel",

    loading = false,

    onConfirm,

    onCancel,

}: ConfirmDialogProps) {

    if (!open) {
        return null;
    }

    return (

        <div
            className="
                fixed inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    bg-white
                    p-6
                    shadow-xl
                "
            >

                <h2 className="text-xl font-bold">

                    {title}

                </h2>

                <p className="mt-3 text-slate-600">

                    {message}

                </p>

                <div className="mt-6 flex justify-end gap-3">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            px-4
                            py-2
                            hover:bg-slate-100
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-red-500
                            px-4
                            py-2
                            text-white
                            hover:bg-red-600
                        "
                    >
                        {loading
                            ? "Please wait..."
                            : confirmText}
                    </button>

                </div>

            </div>

        </div>

    );

}