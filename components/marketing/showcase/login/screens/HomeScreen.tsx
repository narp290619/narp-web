"use client";

import StatusBar from "../ui/StatusBar";
import SearchBar from "../ui/SearchBar";
import ServiceCard from "../ui/ServiceCard";
import SkillCard from "../ui/SkillCard";

export default function HomeScreen() {
    return (
        <div className="h-full bg-slate-50">
            <StatusBar />

            <div className="px-5 pt-6">
                <p className="text-sm text-slate-500">
                    Good Morning 👋
                </p>

                <h1 className="mt-2 text-3xl font-bold leading-tight">
                    Find trusted
                    <br />
                    freelancers
                </h1>

                <SearchBar />

                <h2 className="mt-8 mb-4 font-semibold">
                    Popular Services
                </h2>

                <div className="space-y-3">
                    <SkillCard
                        title="Builder"
                        members="2,351 Freelancers"
                        rating={4.9}
                        badge="Popular"
                        badgeColor="#f97316"
                    />

                    <SkillCard
                        title="Electrician"
                        members="1,842 Freelancers"
                        rating={4.8}
                        badge="Verified"
                        badgeColor="#0ea5e9"
                    />

                    <SkillCard
                        title="Cleaner"
                        members="986 Freelancers"
                        rating={4.9}
                        badge="Top Rated"
                        badgeColor="#10b981"
                    />
                </div>
            </div>
        </div>
    );
}