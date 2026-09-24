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

type PublicAgentConversationMessage = {
    role: "user" | "assistant";
    content: string;
    toolCalls?: Array<Record<string, unknown>>;
    createdAt: number | null;
};

type PublicAgentConversationResponse = {
    success: boolean;
    agentId: string;
    conversationId: string;
    messages: PublicAgentConversationMessage[];
};

const getPublicAgentConversation =
    httpsCallable<
        {
            agentId: string;
            conversationId: string;
        },
        PublicAgentConversationResponse
    >(
        functions,
        "getPublicAgentConversation"
    );

export async function loadPublicAgentConversation(
    agentId: string,
    conversationId: string,
) {
    const cleanAgentId =
        agentId.trim();

    const cleanConversationId =
        conversationId.trim();

    if (!cleanAgentId) {
        throw new Error(
            "Agent ID is required."
        );
    }

    if (!cleanConversationId) {
        throw new Error(
            "Conversation ID is required."
        );
    }

    const result =
        await getPublicAgentConversation({
            agentId:
                cleanAgentId,
            conversationId:
                cleanConversationId,
        });

    return result.data;
}

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
