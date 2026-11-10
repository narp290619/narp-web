
import { httpsCallable } from "firebase/functions";
import {
    doc,
    onSnapshot,
    type Unsubscribe,
} from "firebase/firestore";

import { auth, db, functions } from "@/lib/firebase";
import { getInstallationId } from "@/lib/session";

// ============================================================
// SESSION CLAIM COORDINATION
// ============================================================

let sessionClaimInProgress = false;

type SessionClaimListener = (
    uid: string,
    installationId: string
) => void;

const sessionClaimListeners = new Set<SessionClaimListener>();

export function beginSessionClaim(): void {
    sessionClaimInProgress = true;
}

export function isSessionClaimInProgress(): boolean {
    return sessionClaimInProgress;
}

export function finishSessionClaim(): void {
    sessionClaimInProgress = false;
}

export function notifySessionClaimed(
    uid: string,
    installationId: string
): void {
    sessionClaimListeners.forEach((listener) => {
        listener(uid, installationId);
    });
}

export function subscribeToSessionClaim(
    listener: SessionClaimListener
): () => void {
    sessionClaimListeners.add(listener);

    return () => {
        sessionClaimListeners.delete(listener);
    };
}

// ============================================================
// MONITOR ACTIVE SESSION
// ============================================================

export function monitorActiveSession(
    uid: string,
    installationId: string
): Unsubscribe {
    const userRef = doc(db, "Users", uid);

    let isHandlingReplacement = false;

    return onSnapshot(
        userRef,
        { includeMetadataChanges: true },
        async (snapshot) => {
            if (snapshot.metadata.fromCache) return;
            if (auth.currentUser?.uid !== uid) return;
            if (isHandlingReplacement) return;

            const userData = snapshot.exists()
                ? snapshot.data()
                : null;

            const isOwner = userData?.isOwner === true;
            const activeSessionId = userData?.activeSessionId;

            console.log("WEB SESSION DIAGNOSTICS", {
                monitoredUid: uid,
                authenticatedUid: auth.currentUser?.uid,
                isOwner,
                installationId,
                activeSessionId,
                sessionMatches: activeSessionId === installationId,
            });

            // Owners are exempt from session replacement.
            if (isOwner) return;

            if (
                !snapshot.exists() ||
                activeSessionId !== installationId
            ) {
                isHandlingReplacement = true;

                console.warn(
                    "WEB SESSION REPLACED BY ANOTHER INSTALLATION."
                );

                try {
                    // Never release the active session here.
                    await auth.signOut();
                } catch (error) {
                    console.error(
                        "FAILED TO SIGN OUT AFTER SESSION REPLACEMENT:",
                        error
                    );
                }
            }
        },
        (error) => {
            console.error(
                "WEB ACTIVE SESSION LISTENER ERROR:",
                error
            );
        }
    );
}

// ============================================================
// CLAIM ACTIVE SESSION
// ============================================================

export async function claimWebAdminSession(
    uid: string
): Promise<string> {
    if (auth.currentUser?.uid !== uid) {
        throw new Error(
            "Cannot claim a session for a different authenticated user."
        );
    }

    const installationId = getInstallationId();

    const claimUserSession = httpsCallable<
        { installationId: string },
        {
            success: boolean;
            installationId: string;
        }
    >(functions, "claimUserSession");

    const result = await claimUserSession({
        installationId,
    });

    if (
        result.data.success !== true ||
        result.data.installationId !== installationId
    ) {
        throw new Error(
            "Unable to verify your active session."
        );
    }

    if (auth.currentUser?.uid !== uid) {
        throw new Error(
            "Authentication changed while claiming the session."
        );
    }

    console.log("WEB SESSION CLAIM RESULT", {
        uid,
        installationId,
        returnedInstallationId: result.data.installationId,
        success: result.data.success,
    });

    notifySessionClaimed(uid, installationId);

    return installationId;
}

// ============================================================
// RELEASE ACTIVE SESSION
// ============================================================

export async function releaseWebAdminSession(): Promise<boolean> {
    const installationId = getInstallationId();

    const releaseUserSession = httpsCallable<
        { installationId: string },
        {
            success: boolean;
            released: boolean;
        }
    >(functions, "releaseUserSession");

    const result = await releaseUserSession({
        installationId,
    });

    return result.data.released === true;
}
