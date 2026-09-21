"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    sendMessageToPublicAgent,
} from "@/lib/publicAgent";

const AGENT_ID =
    "p3LeEc6dovtnS0dMi13I";

export default function TestAIAgentPage() {
    const [message, setMessage] =
        useState("");

    const [response, setResponse] =
        useState("");

    const [conversationId, setConversationId] =
        useState<string | undefined>();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !message.trim() ||
            loading
        ) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result =
                await sendMessageToPublicAgent(
                    AGENT_ID,
                    message,
                    conversationId
                );

            setResponse(
                result.response
            );

            setConversationId(
                result.conversationId
            );

            setMessage("");
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to contact AI agent."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClearConversation() {
        setMessage("");
        setResponse("");
        setConversationId(undefined);
        setError("");
    }

    return (
        <main
            style={{
                maxWidth: 800,
                margin: "0 auto",
                padding: 40,
            }}
        >
            <h1>
                NARP AI Agent Test
            </h1>

            <p>
                Testing the real public
                Customer Support Agent.
            </p>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 24,
                }}
            >
                <input
                    value={message}
                    onChange={(event) =>
                        setMessage(
                            event.target.value
                        )
                    }
                    placeholder="Ask NARP AI something..."
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: 12,
                        border:
                            "1px solid #ccc",
                        borderRadius: 8,
                    }}
                />

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !message.trim()
                    }
                    style={{
                        padding:
                            "12px 20px",
                        border: "none",
                        borderRadius: 8,
                        cursor:
                            loading
                                ? "default"
                                : "pointer",
                    }}
                >
                    {loading
                        ? "Thinking..."
                        : "Send"}
                </button>
            </form>

            {error && (
                <div
                    style={{
                        marginTop: 24,
                        padding: 16,
                        borderRadius: 8,
                        background:
                            "#fee2e2",
                    }}
                >
                    <strong>
                        Error:
                    </strong>{" "}
                    {error}
                </div>
            )}

            {response && (
                <div
                    style={{
                        marginTop: 24,
                        padding: 20,
                        borderRadius: 12,
                        background:
                            "#f5f5f5",
                    }}
                >
                    <strong>
                        NARP AI:
                    </strong>

                    <p
                        style={{
                            whiteSpace:
                                "pre-wrap",
                        }}
                    >
                        {response}
                    </p>
                </div>
            )}

            {conversationId && (
                <p
                    style={{
                        marginTop: 20,
                        fontSize: 12,
                        opacity: 0.6,
                    }}
                >
                    Conversation:
                    {" "}
                    {conversationId}
                </p>
            )}

            {(response ||
                conversationId ||
                error) && (
                <button
                    type="button"
                    onClick={
                        handleClearConversation
                    }
                    style={{
                        marginTop: 16,
                        padding:
                            "10px 16px",
                        border:
                            "1px solid #ccc",
                        borderRadius: 8,
                        background:
                            "transparent",
                        cursor: "pointer",
                    }}
                >
                    Clear Conversation
                </button>
            )}
        </main>
    );
}
