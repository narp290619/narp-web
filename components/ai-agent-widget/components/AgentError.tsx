type AgentErrorProps = {
    error: string;
};

export function AgentError({
    error,
}: AgentErrorProps) {
    return (
        <div className="ai-agent-widget__error">
            {error}
        </div>
    );
}