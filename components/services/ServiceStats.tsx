const stats = [
    {
        value: "10,000+",
        label: "Freelancers",
    },
    {
        value: "150+",
        label: "Skills",
    },
    {
        value: "81",
        label: "Provinces",
    },
    {
        value: "4.9★",
        label: "Average Rating",
    },
];

export default function ServiceStats() {
    return (

        <div
            className="
                mb-24
                grid
                gap-6
                sm:grid-cols-2
                lg:grid-cols-4
            "
        >

            {stats.map((stat) => (

                <div
                    key={stat.label}
                    className="
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                    "
                >

                    <h3 className="text-4xl font-bold text-orange-500">

                        {stat.value}

                    </h3>

                    <p className="mt-2 text-slate-500">

                        {stat.label}

                    </p>

                </div>

            ))}

        </div>

    );
}