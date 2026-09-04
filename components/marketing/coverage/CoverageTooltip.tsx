interface Props {
    city: string;
    freelancers: number;
    skills: number;
    rating: number;
}

export default function CoverageTooltip({
    city,
    freelancers,
    skills,
    rating,
}: Props) {
    return (
        <div
            className="

            pointer-events-none
            
        absolute
        bottom-8
        left-1/2
        -translate-x-1/2

        w-56

        rounded-2xl
        border
        border-slate-200

        bg-white

        p-4

        shadow-xl
      "
        >
            <h4 className="font-bold text-slate-900">
                📍 {city}
            </h4>

            <div className="mt-3 space-y-2 text-sm">

                <div className="flex justify-between">
                    <span>👷 Freelancers</span>
                    <span className="font-semibold">
                        {freelancers.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>🛠 Skills</span>
                    <span className="font-semibold">
                        {skills}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>⭐ Rating</span>
                    <span className="font-semibold">
                        {rating}
                    </span>
                </div>

            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">

                <div className="flex items-center gap-2">

                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />

                    <span className="text-xs text-slate-500">
                        Freelancers available
                    </span>

                </div>

            </div>

        </div>
    );
}