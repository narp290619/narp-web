"use client";

import { useMemo, useState } from "react";

import FreelancerCard from "./FreelancerCard";
import FreelancerFilters from "./FreelancerFilters";
import FreelancerSummary from "./FreelancerSummary";
import ActiveFilters from "./ActiveFilters";

interface Props {
    skill: string;

    members: any[];
}

export default function AvailableFreelancers({
    skill,
    members,
}: Props) {

    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("rating");

    const [verifiedOnly, setVerifiedOnly] = useState(false);

    const [maxPrice, setMaxPrice] = useState(20000);

    const [minimumRating, setMinimumRating] = useState(0);

    const totalFreelancers = members.length;

    const verifiedFreelancers = members.filter(
        (m) => m.isVerified
    ).length;

    const averageRating =
        members.length > 0
            ? members.reduce(
                (sum, m) => sum + (m.rating ?? 0),
                0,
            ) / members.length
            : 0;

    const filteredMembers = useMemo(() => {

        let data = [...members];

        // Verified
        if (verifiedOnly) {
            data = data.filter((m) => m.isVerified);
        }

        // Price
        data = data.filter(
            (m) => (m.startingPrice ?? 0) <= maxPrice
        );

        // Rating
        data = data.filter(
            (m) => (m.rating ?? 0) >= minimumRating
        );

        // Search
        if (search.trim()) {
            const keyword = search.toLowerCase();

            data = data.filter((m) =>
                `${m.firstName} ${m.lastName}`
                    .toLowerCase()
                    .includes(keyword)
            );
        }

        // Sorting
        switch (sort) {
            case "price":
                data.sort(
                    (a, b) =>
                        (a.startingPrice ?? 0) -
                        (b.startingPrice ?? 0)
                );
                break;

            case "jobs":
                data.sort(
                    (a, b) =>
                        (b.completedJobs ?? 0) -
                        (a.completedJobs ?? 0)
                );
                break;

            case "reviews":
                data.sort(
                    (a, b) =>
                        (b.reviewCount ?? 0) -
                        (a.reviewCount ?? 0)
                );
                break;

            default:
                data.sort(
                    (a, b) =>
                        (b.rating ?? 0) -
                        (a.rating ?? 0)
                );
        }

        return data;

    }, [
        members,
        search,
        sort,
        verifiedOnly,
        maxPrice,
        minimumRating,
    ]);

    return (

        <section className="mt-20">

            <div className="flex items-end justify-between">

                <div>

                    <h2 className="text-3xl font-bold">

                        Available {skill} Freelancers

                    </h2>

                    <FreelancerSummary
                        total={totalFreelancers}
                        verified={verifiedFreelancers}
                        averageRating={averageRating}
                    />

                    {/* <p className="mt-3 text-slate-600">

                        {filteredMembers.length} freelancer
                        {filteredMembers.length !== 1 && "s"} found

                    </p> */}

                </div>

            </div>

            <FreelancerFilters

                search={search}

                sort={sort}

                verifiedOnly={verifiedOnly}

                maxPrice={maxPrice}

                minimumRating={minimumRating}

                onSearchChange={setSearch}

                onSortChange={setSort}

                onVerifiedChange={setVerifiedOnly}

                onMaxPriceChange={setMaxPrice}

                onMinimumRatingChange={setMinimumRating}

                onReset={() => {

                    setSearch("");

                    setSort("rating");

                    setVerifiedOnly(false);

                    setMinimumRating(0);

                    setMaxPrice(20000);

                }}

            />

            <ActiveFilters

                verifiedOnly={verifiedOnly}

                sort={sort}

                minimumRating={minimumRating}

                maxPrice={maxPrice}

            />

            <div
                className="
                    mt-10
                    grid
                    gap-8

                    md:grid-cols-2
                    xl:grid-cols-3
                "
            >

                {filteredMembers.length === 0 ? (

                    <div
                        className="
                            col-span-full

                            rounded-3xl
                            border-2
                            border-dashed

                            py-20

                            text-center
                        "
                    >

                        <h3 className="text-2xl font-bold">

                            No freelancers found

                        </h3>

                        <p className="mt-3 text-slate-500">

                            Try changing your search or filters.

                        </p>

                    </div>

                ) : (

                    filteredMembers.map((member) => (

                        <FreelancerCard
                            key={member.id}
                            freelancer={member}
                        />

                    ))

                )}

            </div>

        </section>

    );

}