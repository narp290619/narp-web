"use client";

import { useEffect, useState } from "react";

import { showcaseScreens } from "../data";

export default function useShowcase() {

    const [screen, setScreen] =
        useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setScreen((value) =>

                (value + 1) %

                showcaseScreens.length

            );

        }, showcaseScreens[screen].duration);

        return () => clearInterval(timer);

    }, [screen]);

    return {

        screen,

        current:

            showcaseScreens[screen],

    };

}