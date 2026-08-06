"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { PlaceSearchResult } from "@/components/maps/types/PlaceSearchResult";


export function usePlaceSearch() {

    const placesLibrary = useMapsLibrary("places");

    const autocompleteService =
        useRef<google.maps.places.AutocompleteService | null>(null);

    const sessionToken =
        useRef<google.maps.places.AutocompleteSessionToken | null>(null);

    const [loading, setLoading] = useState(false);

    const [results, setResults] = useState<PlaceSearchResult[]>([]);

    const isReady = useMemo(
        () => !!placesLibrary,
        [placesLibrary],
    );

    useEffect(() => {

        if (!placesLibrary) {
            return;
        }

        autocompleteService.current =
            new placesLibrary.AutocompleteService();

        sessionToken.current =
            new placesLibrary.AutocompleteSessionToken();

    }, [placesLibrary]);

    const resetSession = useCallback(() => {

        if (!placesLibrary) {
            return;
        }

        sessionToken.current =
            new placesLibrary.AutocompleteSessionToken();

    }, [placesLibrary]);

    const clear = useCallback(() => {

        setResults([]);

    }, []);

    const search = useCallback(

        async (
            query: string,
        ) => {

            if (!autocompleteService.current) {

                clear();

                return;
            }

            const text = query.trim();

            if (text.length < 2) {

                clear();

                return;
            }

            setLoading(true);

            try {

                const response =
                    await autocompleteService.current.getPlacePredictions({

                        input: text,

                        sessionToken:
                            sessionToken.current ?? undefined,

                    });

                const predictions =
                    response.predictions ?? [];

                const mapped: PlaceSearchResult[] =
                    predictions.map(
                        (
                            prediction,
                        ) => ({

                            placeId:
                                prediction.place_id,

                            title:
                                prediction.structured_formatting.main_text,

                            subtitle:
                                prediction.structured_formatting.secondary_text,

                            description:
                                prediction.description,

                        }),
                    );

                setResults(mapped);

            } catch (error) {

                console.error(
                    "Place search failed",
                    error,
                );

                clear();

            } finally {

                setLoading(false);

            }

        },

        [clear],

    );

    return {

        isReady,

        loading,

        results,

        search,

        clear,

        resetSession,

    };

}