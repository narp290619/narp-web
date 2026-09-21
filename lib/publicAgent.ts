import {
    httpsCallable,
} from "firebase/functions";

import {
    functions,
} from "./firebase";

type PublicAgentResponse = {
    success: boolean;
    agentId: string;
    conversationId: string;
    response: string;
    toolCalls?: Array<Record<string, unknown>>;
};

const runPublicAgent =
    httpsCallable<
        {
            agentId: string;
            message: string;
            conversationId?: string;
        },
        PublicAgentResponse
    >(
        functions,
        "runPublicAgent"
    );

export async function sendMessageToPublicAgent(
    agentId: string,
    message: string,
    conversationId?: string,
) {
    const cleanAgentId =
        agentId.trim();

    const cleanMessage =
        message.trim();

    if (!cleanAgentId) {
        throw new Error(
            "Agent ID is required."
        );
    }

    if (!cleanMessage) {
        throw new Error(
            "Message cannot be empty."
        );
    }

    const result =
        await runPublicAgent({
            agentId:
                cleanAgentId,

            message:
                cleanMessage,

            ...(conversationId
                ? {
                    conversationId,
                }
                : {}),
        });

    return result.data;
}
