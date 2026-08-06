interface Props {

    children: React.ReactNode;

    variant?:
        | "success"
        | "warning"
        | "danger"
        | "info"
        | "neutral";

    size?:
        | "sm"
        | "md";

}

export default function StatusBadge({

    children,

    variant = "neutral",

    size = "sm",

}: Props) {

    const variantClasses = {

        success:
            "bg-green-100 text-green-700",

        warning:
            "bg-amber-100 text-amber-700",

        danger:
            "bg-red-100 text-red-700",

        info:
            "bg-blue-100 text-blue-700",

        neutral:
            "bg-slate-100 text-slate-700",

    };

    const sizeClasses = {

        sm:
            "px-3 py-1 text-xs",

        md:
            "px-4 py-1.5 text-sm",

    };

    return (

        <span
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                font-semibold
                ${variantClasses[variant]}
                ${sizeClasses[size]}
            `}
        >

            <span
                className="
                    h-2
                    w-2
                    rounded-full
                    bg-current
                "
            />

            {children}

        </span>

    );

}