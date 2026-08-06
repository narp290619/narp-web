interface Props {
    icon: string;
    title: string;
    description: string;
}

export default function TrustCard({
    icon,
    title,
    description,
}: Props) {
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-slate-200
                bg-white/90
                p-8
                backdrop-blur-xl
                shadow-sm
                transition-all
                duration-500
                hover:-translate-y-3
                hover:border-orange-300
                hover:shadow-[0_30px_80px_rgba(249,115,22,.15)]
            "
        >
            {/* Hover Gradient */}

            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-orange-50
                    via-white
                    to-orange-100
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />

            <div className="relative">

                {/* Icon */}

                <div
                    className="
                        relative
                        mb-8
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-3xl
                        bg-gradient-to-br
                        from-orange-100
                        to-orange-50
                        text-4xl
                        shadow-lg
                        transition-all
                        duration-500
                        group-hover:scale-110
                        group-hover:rotate-6
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-3xl
                            bg-orange-400/20
                            blur-xl
                            opacity-0
                            transition
                            duration-500
                            group-hover:opacity-100
                        "
                    />

                    <span className="relative">
                        {icon}
                    </span>

                </div>

                {/* Title */}

                <h3
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    {title}
                </h3>

                {/* Description */}

                <p
                    className="
                        mt-4
                        leading-7
                        text-slate-600
                    "
                >
                    {description}
                </p>

            </div>
        </div>
    );
}