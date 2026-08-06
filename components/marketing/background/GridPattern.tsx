"use client";

export default function GridPattern() {
    return (
        <div
            className="
                pointer-events-none
                absolute
                inset-0
                opacity-15
            "
        >
            <div
                className="
                    absolute
                    inset-0
                    bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)]
                    bg-[size:36px_36px]
                "
            />
        </div>
    );
}