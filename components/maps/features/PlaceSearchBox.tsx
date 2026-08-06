"use client";

import { useEffect } from "react";

import { Loader2, MapPin, Search, X } from "lucide-react";

import { PlaceSearchResult } from "../types/PlaceSearchResult";
import { useDebounce } from "@/hooks/useDebounce";

interface PlaceSearchBoxProps {

    value: string;

    onChange(
        value: string,
    ): void;

    results: PlaceSearchResult[];

    loading: boolean;

    onSearch(
        query: string,
    ): void;

    onSelect(
        place: PlaceSearchResult,
    ): void;

    onClear(): void;

    placeholder?: string;

    disabled?: boolean;

}

export default function PlaceSearchBox({

    value,

    onChange,

    results,

    loading,

    onSearch,

    onSelect,

    onClear,

    placeholder = "Search address...",

    disabled = false,

}: PlaceSearchBoxProps) {

    const debouncedSearch =
        useDebounce(value, 400);

    useEffect(() => {

        onSearch(
            debouncedSearch,
        );

    }, [

        debouncedSearch,

        onSearch,

    ]);

    return (

        <div className="relative w-full">

            <div
                className="
                    flex
                    items-center
                    rounded-2xl
                    border
                    bg-white
                    shadow-sm
                "
            >

                <Search
                    size={18}
                    className="ml-4 text-slate-400"
                />

                <input

                    type="text"

                    value={value}

                    disabled={disabled}

                    placeholder={placeholder}

                    onChange={(e) =>
                        onChange(
                            e.target.value,
                        )
                    }

                    className="
                        flex-1
                        bg-transparent
                        px-3
                        py-3
                        outline-none
                    "
                />

                {

                    loading && (

                        <Loader2

                            size={18}

                            className="
                                mr-3
                                animate-spin
                                text-blue-600
                            "
                        />

                    )

                }

                {

                    value.length > 0 && !loading && (

                        <button

                            type="button"

                            onClick={() => {

                                onChange("");

                                onClear();

                            }}

                            className="
                                mr-2
                                rounded-lg
                                p-2
                                transition
                                hover:bg-slate-100
                            "
                        >

                            <X size={18} />

                        </button>

                    )

                }

            </div>

            {

                results.length > 0 && (

                    <div
                        className="
                            absolute
                            z-50
                            mt-2
                            max-h-80
                            w-full
                            overflow-y-auto
                            rounded-2xl
                            border
                            bg-white
                            shadow-xl
                        "
                    >

                        {

                            results.map(

                                (place) => (

                                    <button

                                        key={
                                            place.placeId
                                        }

                                        type="button"

                                        onClick={() => {

                                            onSelect(
                                                place,
                                            );

                                        }}

                                        className="
                                            flex
                                            w-full
                                            items-start
                                            gap-3
                                            px-4
                                            py-3
                                            text-left
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >

                                        <MapPin

                                            size={18}

                                            className="
                                                mt-1
                                                text-blue-600
                                            "
                                        />

                                        <div>

                                            <div
                                                className="
                                                    font-medium
                                                "
                                            >

                                                {

                                                    place.title

                                                }

                                            </div>

                                            {

                                                place.subtitle && (

                                                    <div
                                                        className="
                                                            text-sm
                                                            text-slate-500
                                                        "
                                                    >

                                                        {

                                                            place.subtitle

                                                        }

                                                    </div>

                                                )

                                            }

                                        </div>

                                    </button>

                                ),

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}