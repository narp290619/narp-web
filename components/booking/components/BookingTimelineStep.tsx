interface Props {

    title: string;

    completed: boolean;

    active: boolean;

}

export default function BookingTimelineStep({

    title,

    completed,

    active,

}: Props) {

    return (

        <div className="flex items-center gap-4">

            <div
                className={`
                    h-5
                    w-5
                    rounded-full
                    ${
                        completed
                            ? "bg-green-500"
                            : active
                            ? "bg-orange-500"
                            : "bg-slate-300"
                    }
                `}
            />

            <span
                className={
                    active
                        ? "font-semibold"
                        : "text-slate-500"
                }
            >

                {title}

            </span>

        </div>

    );

}