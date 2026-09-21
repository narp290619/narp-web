import type {
    AgentToolCall,
} from "../hooks/useAgentWidget";

type AgentToolActivityProps = {
    toolCalls: AgentToolCall[];
};

export function AgentToolActivity({
    toolCalls,
}: AgentToolActivityProps) {
    if (toolCalls.length === 0) {
        return null;
    }

    return (
        <div className="ai-agent-widget__tool-activity">
            {toolCalls.map(
                (tool, index) => (
                    <div
                        key={`${tool.name ?? tool.tool ?? "tool"}-${index}`}
                        className="ai-agent-widget__tool"
                    >
                        {tool.name ??
                            tool.tool ??
                            "Agent tool"}
                    </div>
                )
            )}
        </div>
    );
}