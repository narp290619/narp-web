"use client";

import { useEffect, useState } from "react";
import { journey } from "./journey";

export default function useJourney() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIndex((current) => (current + 1) % journey.length);
        }, journey[index].duration);

        return () => clearTimeout(timer);
    }, [index]);

    return {

        index,

        scene: journey[index],

        progress:

            ((index + 1) / journey.length) * 100,

    };
}