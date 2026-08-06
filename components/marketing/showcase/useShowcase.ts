"use client";

import { useCallback, useEffect, useState } from "react";
import { showcaseData } from "./showcaseData";

export function useShowcase() {
    const [active, setActive] = useState(showcaseData[0]);
    const [paused, setPaused] = useState(false);

    const goTo = useCallback((id: string) => {
        const item = showcaseData.find((item) => item.id === id);

        if (item) {
            setActive(item);
        }
    }, []);

    const goToNext = useCallback(() => {
        setActive((current) => {
            const index = showcaseData.findIndex(
                (item) => item.id === current.id
            );

            return showcaseData[
                (index + 1) % showcaseData.length
            ];
        });
    }, []);

    const goToPrevious = useCallback(() => {
        setActive((current) => {
            const index = showcaseData.findIndex(
                (item) => item.id === current.id
            );

            return showcaseData[
                (index - 1 + showcaseData.length) %
                showcaseData.length
            ];
        });
    }, []);

    // Auto play
    useEffect(() => {
        if (paused) return;
        const AUTO_PLAY_DELAY = 5000;

        const timer = setInterval(() => {
            goToNext();
        }, AUTO_PLAY_DELAY);

        return () => clearInterval(timer);
    }, [paused, goToNext]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                goToNext();
            }

            if (event.key === "ArrowLeft") {
                goToPrevious();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [goToNext, goToPrevious]);

    return {
        active,
        paused,
        setPaused,
        goTo,
        goToNext,
        goToPrevious,
    };
}