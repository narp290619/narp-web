import { getFunctions, httpsCallable } from "firebase/functions";
import { getInstallationId } from "@/lib/session";

export async function claimWebAdminSession(): Promise<string> {
    const functions = getFunctions(undefined, "asia-southeast1");
    const installationId = getInstallationId();

    const claimSession = httpsCallable(
        functions,
        "claimUserSession"
    );

    await claimSession({ installationId });

    return installationId;
}