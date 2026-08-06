"use client";

import { useEffect, useRef, useState } from "react";

import BlinkingCursor from "./BlinkingCursor";

interface Props {

    text: string;

    speed?: number;

    onComplete?: () => void;

}

export default function TypingText({

    text,

    speed = 28,

    onComplete,

}: Props) {

    const [display, setDisplay] = useState("");

    const completed = useRef(false);

    useEffect(() => {

        completed.current = false;

        setDisplay("");

        let index = 0;

        const timer = setInterval(() => {

            index++;

            setDisplay(text.slice(0, index));

            if (index >= text.length) {

                clearInterval(timer);

                if (!completed.current) {

                    completed.current = true;

                    onComplete?.();

                }

            }

        }, speed);

        return () => clearInterval(timer);

    }, [text, speed, onComplete]);

    const finished = display.length >= text.length;

    return (

        <span className="font-medium leading-relaxed">

            {display}

            {!finished && <BlinkingCursor />}

        </span>

    );

}