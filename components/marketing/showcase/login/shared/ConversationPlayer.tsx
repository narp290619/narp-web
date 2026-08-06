"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ThinkingIndicator from "./ThinkingIndicator";
import TypingText from "./TypingText";

interface Props {
    messages: string[];

    thinkingDuration?: number;

    pauseDuration?: number;
}

export default function ConversationPlayer({
    messages,
    thinkingDuration = 1000,
    pauseDuration = 1200,
}: Props) {

    const [messageIndex, setMessageIndex] = useState(0);

    const [thinking, setThinking] = useState(true);

    const [typingFinished, setTypingFinished] = useState(false);

    useEffect(() => {

        setMessageIndex(0);
        setThinking(true);
        setTypingFinished(false);

    }, [messages]);

    useEffect(() => {

        const timer = setTimeout(() => {

            setThinking(false);

        }, thinkingDuration);

        return () => clearTimeout(timer);

    }, [messageIndex, thinkingDuration]);

    useEffect(() => {

        if (thinking) return;

        if (!typingFinished) return;

        if (messageIndex >= messages.length - 1) return;

        const timer = setTimeout(() => {

            setTypingFinished(false);

            setThinking(true);

            setMessageIndex((prev) => prev + 1);

        }, pauseDuration);

        return () => clearTimeout(timer);

    }, [
        thinking,
        typingFinished,
        messageIndex,
        messages.length,
        pauseDuration,
    ]);

    return (

        <AnimatePresence mode="wait">

            {thinking ? (

                <motion.div

                    key={`thinking-${messageIndex}`}

                    initial={{
                        opacity: 0,
                        y: 6,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    exit={{
                        opacity: 0,
                        y: -6,
                    }}

                >

                    <ThinkingIndicator />

                </motion.div>

            ) : (

                <motion.div

                    key={`typing-${messageIndex}`}

                    initial={{
                        opacity: 0,
                        y: 6,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    exit={{
                        opacity: 0,
                        y: -6,
                    }}

                >

                    <TypingText

                        text={messages[messageIndex]}

                        onComplete={() => {

                            setTypingFinished(true);

                        }}

                    />

                </motion.div>

            )}

        </AnimatePresence>

    );

}