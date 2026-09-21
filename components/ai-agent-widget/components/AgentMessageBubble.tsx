import type {
    AgentMessage,
} from "../hooks/useAgentWidget";

type AgentMessageBubbleProps = {
    message: AgentMessage;
};

export function AgentMessageBubble({
    message,
}: AgentMessageBubbleProps) {
    const isUser =
        message.role === "user";

    return (
        <div
            className={`ai-agent-widget__message-row ${
                isUser
                    ? "ai-agent-widget__message-row--user"
                    : "ai-agent-widget__message-row--assistant"
            }`}
        >
            <div
                className={`ai-agent-widget__message-bubble ${
                    isUser
                        ? "ai-agent-widget__message-bubble--user"
                        : "ai-agent-widget__message-bubble--assistant"
                }`}
            >
                {message.content}
            </div>
        </div>
    );
}