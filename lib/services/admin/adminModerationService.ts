import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { getInstallationId } from "@/lib/session";

type SetUserBanStatusResponse = {
    success: boolean;
    userId: string;
    previousBanned: boolean;
    banned: boolean;
    changed: boolean;
    message: string;
};

export async function setUserBanStatus(
    userId: string,
    banned: boolean,
    reportId: string,
    moderationNote: string
): Promise<SetUserBanStatusResponse> {
    const normalizedNote = moderationNote.trim();

    if (!normalizedNote) {
        throw new Error("A moderation note is required.");
    }

    if (normalizedNote.length > 1000) {
        throw new Error(
            "Moderation note cannot exceed 1000 characters."
        );
    }

    const callable = httpsCallable<
        {
            userId: string;
            banned: boolean;
            installationId: string;
            clientPlatform: "web";
            reportId: string;
            moderationNote: string;
        },
        SetUserBanStatusResponse
    >(functions, "setUserBanStatus");

    const result = await callable({
        userId,
        banned,
        installationId: getInstallationId(),
        clientPlatform: "web",
        reportId,
        moderationNote: normalizedNote,
    });

    return result.data;
}