"use client";

import { motion } from "framer-motion";
import {
    BadgeCheck,
    Clock3,
    MapPin,
    Sparkles,
    Star,
} from "lucide-react";

export default function RecommendationCard() {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 24,
                scale: 0.95,
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.45,
            }}
            className="
                overflow-hidden
                rounded-3xl
                border
                border-orange-200
                bg-white
                shadow-xl
            "
        >
            {/* Header */}

            <div
                className="
                    bg-gradient-to-r
                    from-orange-500
                    to-orange-400
                    p-5
                    text-white
                "
            >
                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-widest text-orange-100">
                            AI Recommendation
                        </p>

                        <h4 className="mt-1 text-xl font-bold">
                            Best Match Found
                        </h4>

                    </div>

                    <div
                        className="
                            rounded-full
                            bg-white/20
                            p-2
                        "
                    >
                        <Sparkles className="h-5 w-5" />
                    </div>

                </div>
            </div>

            {/* Body */}

            <div className="p-5">

                <div className="flex items-start gap-4">

                    {/* Avatar */}

                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-orange-100
                            text-2xl
                        "
                    >
                        👷
                    </div>

                    <div className="flex-1">

                        <div className="flex items-center gap-2">

                            <h3 className="font-bold text-slate-900">
                                Juan Dela Cruz
                            </h3>

                            <BadgeCheck className="h-5 w-5 text-emerald-500" />

                        </div>

                        <p className="text-sm text-slate-500">
                            Licensed Electrician
                        </p>

                        <div
                            className="
                                mt-3
                                inline-flex
                                items-center
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-emerald-700
                            "
                        >
                            98% AI Match
                        </div>

                    </div>

                </div>

                {/* Stats */}

                <div className="mt-6 space-y-3">

                    <div className="flex items-center gap-3">

                        <Star
                            className="
                                h-4
                                w-4
                                fill-yellow-400
                                text-yellow-400
                            "
                        />

                        <span className="text-sm text-slate-700">
                            4.9 ★ (127 reviews)
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <MapPin
                            className="
                                h-4
                                w-4
                                text-orange-500
                            "
                        />

                        <span className="text-sm text-slate-700">
                            1.8 km away
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <Clock3
                            className="
                                h-4
                                w-4
                                text-emerald-500
                            "
                        />

                        <span className="text-sm text-slate-700">
                            Available in 30 minutes
                        </span>

                    </div>

                </div>

                {/* Why AI chose this */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        bg-slate-50
                        p-4
                    "
                >
                    <p className="mb-3 text-sm font-semibold text-slate-900">
                        Why NARP AI selected this freelancer
                    </p>

                    <ul className="space-y-2 text-sm text-slate-600">

                        <li>✓ Matches your requested skills</li>

                        <li>✓ Highly rated by previous customers</li>

                        <li>✓ Available tomorrow morning</li>

                        <li>✓ Located near your area</li>

                    </ul>

                </div>

                {/* CTA */}

                <button
                    className="
                        mt-6
                        w-full
                        rounded-full
                        bg-orange-500
                        py-3.5
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-orange-600
                        hover:shadow-lg
                    "
                >
                    Book this Freelancer
                </button>

            </div>
        </motion.div>
    );
}