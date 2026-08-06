"use client";

import { Search, RotateCcw } from "lucide-react";

interface Props {

    search: string;

    sort: string;

    verifiedOnly: boolean;

    maxPrice: number;

    minimumRating: number;

    onSearchChange: (value: string) => void;

    onSortChange: (value: string) => void;

    onVerifiedChange: (value: boolean) => void;

    onMaxPriceChange: (value: number) => void;

    onMinimumRatingChange: (value: number) => void;

    onReset: () => void;

}

export default function FreelancerFilters({

    search,

    sort,

    verifiedOnly,

    maxPrice,

    minimumRating,

    onSearchChange,

    onSortChange,

    onVerifiedChange,

    onMaxPriceChange,

    onMinimumRatingChange,

    onReset,

}: Props) {

    return (

        <div className="mt-10 rounded-3xl border bg-white p-8 shadow-sm">

            <div className="grid gap-8 lg:grid-cols-3">

                {/* SEARCH */}

                <div>

                    <label className="mb-2 block font-semibold">

                        Search

                    </label>

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                onSearchChange(e.target.value)
                            }
                            placeholder="Search freelancers..."
                            className="w-full rounded-2xl border py-3 pl-11 pr-4"
                        />

                    </div>

                </div>

                {/* SORT */}

                <div>

                    <label className="mb-2 block font-semibold">

                        Sort By

                    </label>

                    <select
                        value={sort}
                        onChange={(e) =>
                            onSortChange(e.target.value)
                        }
                        className="w-full rounded-2xl border p-3"
                    >

                        <option value="rating">

                            Highest Rated

                        </option>

                        <option value="price">

                            Lowest Price

                        </option>

                        <option value="jobs">

                            Most Jobs

                        </option>

                        <option value="reviews">

                            Most Reviews

                        </option>

                    </select>

                </div>

                {/* VERIFIED */}

                <div className="flex items-end">

                    <label className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            checked={verifiedOnly}
                            onChange={(e) =>
                                onVerifiedChange(
                                    e.target.checked
                                )
                            }
                        />

                        Verified Only

                    </label>

                </div>

            </div>

            {/* PRICE */}

            <div className="mt-8">

                <div className="mb-2 flex justify-between">

                    <span className="font-semibold">

                        Maximum Starting Price

                    </span>

                    <span>

                        ₱{maxPrice.toLocaleString()}

                    </span>

                </div>

                <input
                    type="range"
                    min={500}
                    max={20000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) =>
                        onMaxPriceChange(
                            Number(e.target.value)
                        )
                    }
                    className="w-full"
                />

            </div>

            {/* RATING */}

            <div className="mt-8">

                <label className="mb-2 block font-semibold">

                    Minimum Rating

                </label>

                <select
                    value={minimumRating}
                    onChange={(e) =>
                        onMinimumRatingChange(
                            Number(e.target.value)
                        )
                    }
                    className="rounded-2xl border p-3"
                >

                    <option value={0}>Any Rating</option>

                    <option value={5}>★★★★★</option>

                    <option value={4}>★★★★☆ & Up</option>

                    <option value={3}>★★★☆☆ & Up</option>

                </select>

            </div>

            <button
                onClick={onReset}
                className="mt-8 flex items-center gap-2 rounded-full border px-5 py-3 font-semibold"
            >

                <RotateCcw size={18} />

                Reset Filters

            </button>

        </div>

    );

}