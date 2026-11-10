import {
    onAuthStateChanged,
    signOut,
    type Unsubscribe as AuthUnsubscribe,
} from "firebase/auth";

import {
    doc,
    onSnapshot,
    type Unsubscribe,
} from "firebase/firestore";

import { httpsCallable } from "firebase/functions";

import {
    auth,
    db,
    functions,
} from "@/lib/firebase";

import { getInstallationId } from "@/lib/session";

// ============================================================
// SESSION STATE
// ============================================================

let authUnsubscribe: AuthUnsubscribe | null = null;

let sessionUnsubscribe: Unsubscribe | null = null;

let isClaimingSession = false;

let isHandlingReplacement = false;

// ============================================================
// STOP FIRESTORE SESSION LISTENER
// ============================================================

export function stopSessionListener(): void {
    if (sessionUnsubscribe) {
        sessionUnsubscribe();
        sessionUnsubscribe = null;
    }
}

// ============================================================
// MONITOR ACTIVE SESSION
// ============================================================

export function monitorActiveSession(
    uid: string,
    installationId: string
): void {

    stopSessionListener();

    isHandlingReplacement = false;

    const userRef = doc(db, "Users", uid);

    sessionUnsubscribe = onSnapshot(
        userRef,
        { includeMetadataChanges: true },
        async (snapshot) => {

            // Ignore cached Firestore data.
            if (snapshot.metadata.fromCache) {
                return;
            }

            // Ignore events after authentication changes.
            if (auth.currentUser?.uid !== uid) {
                return;
            }

            if (isHandlingReplacement) {
                return;
            }

            const activeSessionId =
                snapshot.data()?.activeSessionId;

            console.log("========== WEB SESSION LISTENER ==========");
            console.log("UID:", uid);
            console.log("Installation ID:", installationId);
            console.log("Active Session ID:", activeSessionId);
            console.log(
                "Session Matches:",
                activeSessionId === installationId
            );
            console.log("==========================================");

            // Account deleted or another installation claimed the session.
            if (
                !snapshot.exists() ||
                activeSessionId !== installationId
            ) {
                isHandlingReplacement = true;

                stopSessionListener();

                console.warn(
                    "WEB SESSION REPLACED BY ANOTHER INSTALLATION."
                );

                try {
                    // Do not release the session here.
                    // It belongs to the newer installation.
                    await signOut(auth);
                } catch (error) {
                    console.error(
                        "FAILED TO SIGN OUT AFTER SESSION REPLACEMENT:",
                        error
                    );
                } finally {
                    isHandlingReplacement = false;
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
// INITIALIZE SESSION MONITORING
// ============================================================

export function initializeSessionMonitoring(): () => void {

    // Prevent duplicate authentication listeners.
    if (authUnsubscribe) {
        return () => {};
    }

    authUnsubscribe = onAuthStateChanged(
        auth,
        (user) => {

            stopSessionListener();

            if (!user) {
                return;
            }

            // Do not check the session while login is claiming it.
            if (isClaimingSession) {
                return;
            }

            const installationId = getInstallationId();

            // On page refresh, verify the existing session.
            // Never claim a new session automatically here.
            monitorActiveSession(
                user.uid,
                installationId
            );
        }
    );

    return () => {
        authUnsubscribe?.();
        authUnsubscribe = null;

        stopSessionListener();
    };
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

    isClaimingSession = true;

    try {
        const installationId = getInstallationId();

        const claimUserSession = httpsCallable<
            { installationId: string },
            {
                success: boolean;
                installationId: string;
            }
        >(
            functions,
            "claimUserSession"
        );

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

        // Start monitoring only after the claim succeeds.
        monitorActiveSession(
            uid,
            installationId
        );

        console.log("WEB ACTIVE SESSION CLAIMED:", {
            uid,
            installationId,
        });

        return installationId;

    } finally {
        isClaimingSession = false;
    }
}

// ============================================================
// RELEASE ACTIVE SESSION
// ============================================================

export async function releaseWebAdminSession(): Promise<boolean> {

    stopSessionListener();

    const installationId = getInstallationId();

    const releaseUserSession = httpsCallable<
        { installationId: string },
        {
            success: boolean;
            released: boolean;
        }
    >(
        functions,
        "releaseUserSession"
    );

    const result = await releaseUserSession({
        installationId,
    });

    return result.data.released === true;
}