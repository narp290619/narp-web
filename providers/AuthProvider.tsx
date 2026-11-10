// "use client";

// import {
//     onAuthStateChanged,
//     User,
// } from "firebase/auth";

// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
// } from "react";

// import { auth } from "@/lib/firebase";

// interface AuthContextType {

//     user: User | null;

//     loading: boolean;

// }

// const AuthContext =
//     createContext<AuthContextType>({

//         user: null,

//         loading: true,

//     });

// export function AuthProvider({

//     children,

// }: {

//     children: React.ReactNode;

// }) {

//     const [user, setUser] =
//         useState<User | null>(null);

//     const [loading, setLoading] =
//         useState(true);

//     useEffect(() => {

//         const unsubscribe =
//             onAuthStateChanged(

//                 auth,

//                 (user) => {

//                     setUser(user);

//                     setLoading(false);

//                 }

//             );

//         return unsubscribe;

//     }, []);

//     return (

//         <AuthContext.Provider

//             value={{

//                 user,

//                 loading,

//             }}

//         >

//             {children}

//         </AuthContext.Provider>

//     );

// }

// export function useAuthContext() {

//     return useContext(AuthContext);

// }





"use client";

import {
    onAuthStateChanged,
    type User,
} from "firebase/auth";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    doc,
    onSnapshot,
    type Unsubscribe,
} from "firebase/firestore";

import {
    auth,
    db,
} from "@/lib/firebase";

import {
    isSessionClaimInProgress,
    monitorActiveSession,
    subscribeToSessionClaim,
} from "@/lib/services/session/session.service";

import { getInstallationId } from "@/lib/session";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    adminLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    adminLoading: true,
});

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
        let sessionUnsubscribe: Unsubscribe | null = null;
        let adminUnsubscribe: Unsubscribe | null = null;

        function stopSessionMonitoring() {
            sessionUnsubscribe?.();
            sessionUnsubscribe = null;
        }

        function stopAdminMonitoring() {
            adminUnsubscribe?.();
            adminUnsubscribe = null;
        }

        function startSessionMonitoring(
            uid: string,
            installationId: string
        ) {
            stopSessionMonitoring();

            if (auth.currentUser?.uid !== uid) {
                return;
            }

            sessionUnsubscribe = monitorActiveSession(
                uid,
                installationId
            );
        }

        function startAdminMonitoring(uid: string) {
            stopAdminMonitoring();

            setIsAdmin(false);
            setAdminLoading(true);

            const userRef = doc(db, "Users", uid);

            adminUnsubscribe = onSnapshot(
                userRef,
                { includeMetadataChanges: true },
                (snapshot) => {
                    // Do not authorize using cached Firestore data.
                    if (snapshot.metadata.fromCache) {
                        return;
                    }

                    const admin =
                        snapshot.exists() &&
                        snapshot.data().isAdmin === true;

                    setIsAdmin(admin);
                    setAdminLoading(false);
                },
                (error) => {
                    console.error(
                        "Failed to monitor admin status:",
                        error
                    );

                    setIsAdmin(false);
                    setAdminLoading(false);
                }
            );
        }

        // Listen for successful session claims.
        const unsubscribeSessionClaim =
            subscribeToSessionClaim(
                (uid, installationId) => {
                    startSessionMonitoring(
                        uid,
                        installationId
                    );
                }
            );

        // Listen for Firebase authentication changes.
        const unsubscribeAuth = onAuthStateChanged(
            auth,
            (currentUser) => {
                stopSessionMonitoring();
                stopAdminMonitoring();

                setUser(currentUser);
                setLoading(false);

                if (!currentUser) {
                    setIsAdmin(false);
                    setAdminLoading(false);
                    return;
                }

                // Start monitoring the user's admin status.
                startAdminMonitoring(currentUser.uid);

                // Login is still claiming its session.
                // Wait for the successful claim notification.
                if (isSessionClaimInProgress()) {
                    return;
                }

                // Browser refresh / restored authentication:
                // verify the existing session without claiming it.
                try {
                    const installationId = getInstallationId();

                    startSessionMonitoring(
                        currentUser.uid,
                        installationId
                    );
                } catch (error) {
                    console.error(
                        "FAILED TO INITIALIZE SESSION MONITORING:",
                        error
                    );
                }
            }
        );

        return () => {
            unsubscribeAuth();
            unsubscribeSessionClaim();

            stopSessionMonitoring();
            stopAdminMonitoring();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin,
                adminLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
