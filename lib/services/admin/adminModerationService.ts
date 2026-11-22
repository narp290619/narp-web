
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
    reportId?: string
): Promise<SetUserBanStatusResponse> {
    const callable = httpsCallable<
        {
            userId: string;
            banned: boolean;
            installationId: string;
            clientPlatform: "web";
            reportId?: string;
        },
        SetUserBanStatusResponse
    >(functions, "setUserBanStatus");

    const result = await callable({
        userId,
        banned,
        installationId: getInstallationId(),
        clientPlatform: "web",
        ...(reportId ? { reportId } : {}),
    });

    return result.data;
}
