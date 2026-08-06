"use client";

interface Props {
    color: string;
    label: string;
}

export default function CategoryBadge({
    color,
    label,
}: Props) {
    return (
        <div
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{
                backgroundColor: color,
            }}
        >
            {label}
        </div>
    );
}