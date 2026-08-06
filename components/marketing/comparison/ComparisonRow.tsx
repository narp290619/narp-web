interface Props {
    title: string;
    traditional: string;
    narp: string;
}

export default function ComparisonRow({
    title,
    traditional,
    narp,
}: Props) {

    return (

        <div className="grid grid-cols-3 border-b border-slate-200 py-6">

            <div className="font-semibold text-slate-700">
                {title}
            </div>

            <div className="text-red-500">
                ❌ {traditional}
            </div>

            <div className="font-semibold text-green-600">
                ✅ {narp}
            </div>

        </div>

    );
}