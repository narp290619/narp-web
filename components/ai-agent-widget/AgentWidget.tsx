"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useAgentWidget,
} from "./hooks/useAgentWidget";

import {
    AgentMessageBubble,
} from "./components/AgentMessageBubble";

import {
    AgentLoading,
} from "./components/AgentLoading";

import {
    AgentToolActivity,
} from "./components/AgentToolActivity";

import {
    AgentError,
} from "./components/AgentError";

import {
    defaultAgentWidgetTheme,
    type AgentWidgetTheme,
} from "./theme/agentWidgetTheme";

import "./AgentWidget.css";

export type AgentWidgetProps = {
    agentId: string;

    name?: string;
    subtitle?: string;
    greeting?: string;

    avatar?: string;

    placeholder?: string;

    theme?: AgentWidgetTheme;

    position?: "bottom-right" | "bottom-left";

    showToolActivity?: boolean;

    showPoweredBy?: boolean;
};

export function AgentWidget({
    agentId,
    name = "AI Assistant",
    subtitle = "How can we help?",
    greeting = "Hi! How can I help you today?",
    avatar,
    placeholder = "Ask anything...",
    theme = defaultAgentWidgetTheme,
    position = "bottom-right",
    showToolActivity = true,
    showPoweredBy = true,
}: AgentWidgetProps) {
    const [
        isOpen,
        setIsOpen,
    ] = useState(false);

    const messagesEndRef =
        useRef<HTMLDivElement | null>(null);

    const {
        input,
        setInput,

        messages,

        isLoading,

        error,

        toolCalls,

        sendMessage,

        clearConversation,
    } = useAgentWidget({
        agentId,
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [
        messages,
        isLoading,
        toolCalls,
        error,
    ]);

    const style = {
        "--agent-widget-primary":
            theme.primary,

        "--agent-widget-primary-foreground":
            theme.primaryForeground,

        "--agent-widget-background":
            theme.background,

        "--agent-widget-surface":
            theme.surface,

        "--agent-widget-surface-muted":
            theme.surfaceMuted,

        "--agent-widget-text":
            theme.text,

        "--agent-widget-text-muted":
            theme.textMuted,

        "--agent-widget-border":
            theme.border,

        "--agent-widget-user-message":
            theme.userMessage,

        "--agent-widget-user-message-foreground":
            theme.userMessageForeground,

        "--agent-widget-assistant-message":
            theme.assistantMessage,

        "--agent-widget-assistant-message-foreground":
            theme.assistantMessageForeground,

        "--agent-widget-error":
            theme.error,

        "--agent-widget-error-background":
            theme.errorBackground,

        "--agent-widget-message-radius":
            theme.radius.message,

        "--agent-widget-panel-width":
            `${theme.sizes.panelWidth}px`,

        "--agent-widget-panel-height":
            `${theme.sizes.panelHeight}px`,

        "--agent-widget-button-size":
            `${theme.sizes.button}px`,
    } as React.CSSProperties;

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>
    ) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            void sendMessage();
        }
    }

    function handleOpen() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <div
            className="ai-agent-widget"
            data-position={position}
            data-open={isOpen}
            style={style}
        >
            {isOpen && (
                <section
                    className="ai-agent-widget__panel"
                    aria-label={name}
                >
                    {/* Header */}
                    <header className="ai-agent-widget__header">
                        <div className="ai-agent-widget__identity">
                            <div className="ai-agent-widget__avatar">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt=""
                                    />
                                ) : (
                                    "✦"
                                )}
                            </div>

                            <div className="ai-agent-widget__identity-text">
                                <p className="ai-agent-widget__name">
                                    {name}
                                </p>

                                <p className="ai-agent-widget__subtitle">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            {messages.length > 0 && (
                                <button
                                    type="button"
                                    className="ai-agent-widget__close"
                                    onClick={
                                        clearConversation
                                    }
                                    aria-label="Clear conversation"
                                    title="Clear conversation"
                                >
                                    ↻
                                </button>
                            )}

                            <button
                                type="button"
                                className="ai-agent-widget__close"
                                onClick={handleClose}
                                aria-label="Close AI assistant"
                            >
                                ×
                            </button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="ai-agent-widget__content">
                        {messages.length === 0 ? (
                            <div className="ai-agent-widget__placeholder">
                                <p className="ai-agent-widget__placeholder-title">
                                    {greeting}
                                </p>

                                <p className="ai-agent-widget__placeholder-text">
                                    Ask a question to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="ai-agent-widget__messages">
                                {messages.map(
                                    (message) => (
                                        <AgentMessageBubble
                                            key={message.id}
                                            message={message}
                                        />
                                    )
                                )}

                                {/* Loading */}
                                {isLoading && (
                                    <AgentLoading />
                                )}

                                {/* Tool activity */}
                                {showToolActivity && (
                                    <AgentToolActivity
                                        toolCalls={toolCalls}
                                    />
                                )}

                                {/* Error */}
                                {error && (
                                    <AgentError
                                        error={error}
                                    />
                                )}

                                {/* Auto-scroll anchor */}
                                <div
                                    ref={messagesEndRef}
                                    aria-hidden="true"
                                />
                            </div>
                        )}
                    </div>

                    {/* Composer */}
                    <div className="ai-agent-widget__composer">
                        <div className="ai-agent-widget__composer-inner">
                            <input
                                type="text"
                                className="ai-agent-widget__input"
                                value={input}
                                onChange={(
                                    event
                                ) =>
                                    setInput(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder={
                                    placeholder
                                }
                                aria-label="Message"
                                disabled={
                                    isLoading
                                }
                            />

                            <button
                                type="button"
                                className="ai-agent-widget__send"
                                onClick={() =>
                                    void sendMessage()
                                }
                                disabled={
                                    isLoading ||
                                    !input.trim()
                                }
                                aria-label="Send message"
                            >
                                ↑
                            </button>
                        </div>

                        {showPoweredBy && (
                            <div
                                style={{
                                    marginTop: 6,
                                    textAlign:
                                        "center",
                                    fontSize: 10,
                                    color:
                                        theme.textMuted,
                                }}
                            >
                                Powered by NARP AI
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Floating Button */}
            <button
                type="button"
                className="ai-agent-widget__button"
                onClick={
                    isOpen
                        ? handleClose
                        : handleOpen
                }
                aria-label={
                    isOpen
                        ? "Close AI assistant"
                        : "Open AI assistant"
                }
                aria-expanded={isOpen}
            >
                <span className="ai-agent-widget__button-icon">
                    {isOpen ? "×" : "✦"}
                </span>
            </button>
        </div>
    );
}
