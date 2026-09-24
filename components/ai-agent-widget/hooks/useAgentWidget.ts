"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    loadPublicAgentConversation,
    sendMessageToPublicAgent,
} from "@/lib/publicAgent";

export type AgentMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: number;
    toolCalls?: AgentToolCall[];
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

const CONVERSATION_STORAGE_PREFIX =
    "narp-agent-conversation:";

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

    useEffect(() => {
        const storageKey =
            `${CONVERSATION_STORAGE_PREFIX}${agentId}`;

        const storedConversationId =
            window.localStorage.getItem(
                storageKey
            );

        if (
            storedConversationId
        ) {
            setConversationId(
                storedConversationId
            );
        }
    }, [agentId]);

    useEffect(() => {
        if (!conversationId) {
            return;
        }

        const currentConversationId =
            conversationId;

        let cancelled = false;

        async function loadConversation() {
            try {
                const result =
                    await loadPublicAgentConversation(
                        agentId,
                        currentConversationId
                    );

                if (cancelled) {
                    return;
                }

                const restoredMessages: AgentMessage[] =
                    result.messages
                        .filter(
                            (message) =>
                                (
                                    message.role ===
                                    "user" ||
                                    message.role ===
                                    "assistant"
                                ) &&
                                typeof message.content ===
                                "string"
                        )
                        .map(
                            (
                                message,
                                index
                            ) => ({
                                id:
                                    `${currentConversationId}-${index}`,
                                role:
                                    message.role,
                                content:
                                    message.content,
                                createdAt:
                                    typeof message.createdAt ===
                                        "number"
                                        ? message.createdAt
                                        : Date.now(),
                                toolCalls:
                                    message.toolCalls || [],
                            })
                        );

                setMessages(
                    restoredMessages
                );

            } catch (err) {
                console.error(
                    "Failed to restore agent conversation:",
                    err
                );
            }
        }

        loadConversation();

        return () => {
            cancelled = true;
        };
    }, [
        agentId,
        conversationId,
    ]);

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

            window.localStorage.setItem(
                `${CONVERSATION_STORAGE_PREFIX}${agentId}`,
                result.conversationId
            );

            const assistantMessage: AgentMessage = {
                id: createMessageId(),
                role: "assistant",
                content: result.response,
                createdAt: Date.now(),
                toolCalls:
                    result.toolCalls || [],
            };

            setMessages((current) => [
                ...current,
                assistantMessage,
            ]);

            setToolCalls([]);
        } catch (err) {
            console.error(
                "Agent widget error:",
                err
            );

            console.error(
                "Agent widget error details:",
                JSON.stringify(
                    err,
                    Object.getOwnPropertyNames(err),
                    2
                )
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
        window.localStorage.removeItem(
            `${CONVERSATION_STORAGE_PREFIX}${agentId}`
        );

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
