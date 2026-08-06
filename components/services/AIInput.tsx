"use client";

interface Props {
    value: string;
    onChange(value: string): void;
}

export default function AIInput({
    value,
    onChange,
}: Props) {
    return (
        <textarea
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe what you need..."

            className="
                w-full
                rounded-3xl
                border
                border-slate-300
                bg-white
                p-6
                text-lg
                outline-none
                transition
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
            "
        />
    );
}