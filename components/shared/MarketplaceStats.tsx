
"use client";

import { useEffect, useState } from "react";
import {
    doc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import StatCard from "@/components/shared/StatCard";

interface MarketplaceStatsData {
    totalFreelancers: number;
    totalSkills: number;
    averageRating: number;
    totalReviews: number;
}

const defaultStats: MarketplaceStatsData = {
    totalFreelancers: 0,
    totalSkills: 0,
    averageRating: 0,
    totalReviews: 0,
};

export default function MarketplaceStats() {
    const [stats, setStats] =
        useState<MarketplaceStatsData>(defaultStats);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const statsRef = doc(db, "publicStats", "marketplace");

        const unsubscribe = onSnapshot(
            statsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();

                    setStats({
                        totalFreelancers:
                            Number(data.totalFreelancers) || 0,

                        totalSkills:
                            Number(data.totalSkills) || 0,

                        averageRating:
                            Number(data.averageRating) || 0,

                        totalReviews:
                            Number(data.totalReviews) || 0,
                    });

                    setError(false);
                } else {
                    setError(true);
                }

                setLoading(false);
            },
            (err) => {
                console.error(
                    "Marketplace statistics error:",
                    err
                );

                setError(true);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 xl:gap-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="min-h-[100px] animate-pulse rounded-2xl bg-slate-200/70"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
                Marketplace statistics are temporarily unavailable.
            </div>
        );
    }

    return (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 xl:gap-5">

            <StatCard
                icon="👷"
                value={stats.totalFreelancers}
                suffix="+"
                title="Freelancers"
            />

            <StatCard
                icon="🛠️"
                value={stats.totalSkills}
                suffix="+"
                title="Skills"
            />

            <StatCard
                icon="⭐"
                value={stats.averageRating}
                decimals={2}
                title="Average Rating"
            />

            <StatCard
                icon="📝"
                value={stats.totalReviews}
                suffix="+"
                title="Reviews"
            />

        </div>
    );
}
