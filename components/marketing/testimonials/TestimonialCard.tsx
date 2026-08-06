import Image from "next/image";
import { CheckCircle2, MapPin, Star } from "lucide-react";

interface Props {
    name: string;
    role: string;
    location: string;
    avatar: string;
    rating: number;
    review: string;
    className?: string;
}

export default function TestimonialCard({
    name,
    role,
    location,
    avatar,
    rating,
    review,
    className = "",
}: Props) {
    return (
        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
                transition-all
                duration-500
                hover:-translate-y-3
                hover:border-orange-300
                hover:shadow-[0_30px_80px_rgba(249,115,22,.15)]
                ${className}
            `}
        >
            {/* Background Quote */}

            <div
                className="
                    absolute
                    right-6
                    top-2
                    text-[110px]
                    font-black
                    leading-none
                    text-orange-100
                    select-none
                "
            >
                "
            </div>

            {/* Stars */}

            <div className="relative mb-6 flex gap-1">

                {Array.from({ length: rating }).map((_, index) => (

                    <Star
                        key={index}
                        className="h-5 w-5 fill-orange-400 text-orange-400"
                    />

                ))}

            </div>

            {/* Review */}

            <p
                className="
                    relative
                    text-lg
                    italic
                    leading-8
                    text-slate-600
                "
            >
                "{review}"
            </p>

            {/* User */}

            <div
                className="
                    relative
                    mt-10
                    flex
                    items-center
                    gap-4
                "
            >

                <div
                    className="
                        relative
                        h-16
                        w-16
                        overflow-hidden
                        rounded-full
                        ring-2
                        ring-orange-200
                        transition
                        duration-500
                        group-hover:scale-110
                    "
                >

                    <Image
                        src={avatar}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={name}
                        fill
                        className="object-cover"
                    />

                </div>

                <div>

                    <h3
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        {name}
                    </h3>

                    <p className="text-sm text-slate-500">

                        {role}

                    </p>

                    <div
                        className="
                            mt-1
                            flex
                            items-center
                            gap-1
                            text-sm
                            text-slate-400
                        "
                    >

                        <MapPin className="h-4 w-4" />

                        {location}

                    </div>

                </div>

            </div>

            {/* Verified */}

            <div
                className="
                    mt-8
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-green-600
                "
            >

                <CheckCircle2 className="h-4 w-4" />

                Verified Booking

            </div>

        </div>
    );
}