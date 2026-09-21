"use client";

import {
    useState,
} from "react";

import {
    sendMessageToPublicAgent,
} from "@/lib/publicAgent";

export type AgentMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: number;
};

export type AgentToolCall = {
    tool?: string;
    name?: string;
    arguments?: Record<string, unknown>;
    result?: unknown;
};

type UseAgentWidgetOptions = {
    agentId: string;
};

function createMessageId() {
    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

export function useAgentWidget({
    agentId,
}: UseAgentWidgetOptions) {
    const [
        input,
        setInput,
    ] = useState("");

    const [
        messages,
        setMessages,
    ] = useState<AgentMessage[]>([]);

    const [
        conversationId,
        setConversationId,
    ] = useState<string | undefined>(
        undefined
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    const [
        toolCalls,
        setToolCalls,
    ] = useState<AgentToolCall[]>([]);

    async function sendMessage() {
        const cleanMessage =
            input.trim();

        if (
            !cleanMessage ||
            isLoading
        ) {
            return;
        }

        setError(null);
        setInput("");

        const userMessage: AgentMessage = {
            id: createMessageId(),
            role: "user",
            content: cleanMessage,
            createdAt: Date.now(),
        };

        setMessages((current) => [
            ...current,
            userMessage,
        ]);

        setIsLoading(true);

        try {
            const result =
                await sendMessageToPublicAgent(
                    agentId,
                    cleanMessage,
                    conversationId
                );

            setConversationId(
                result.conversationId
            );

            const assistantMessage: AgentMessage = {
                id: createMessageId(),
                role: "assistant",
                content: result.response,
                createdAt: Date.now(),
            };

            setMessages((current) => [
                ...current,
                assistantMessage,
            ]);

            if (result.toolCalls) {
                setToolCalls(
                    result.toolCalls
                );
            }
        } catch (err) {
            console.error(
                "Agent widget error:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function clearConversation() {
        setMessages([]);
        setConversationId(undefined);
        setToolCalls([]);
        setError(null);
        setInput("");
    }

    return {
        input,
        setInput,

        messages,

        conversationId,

        isLoading,

        error,

        toolCalls,

        sendMessage,

        clearConversation,
    };
}
