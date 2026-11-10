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

import type { Unsubscribe } from "firebase/firestore";

import { auth } from "@/lib/firebase";

import {
    isSessionClaimInProgress,
    monitorActiveSession,
    subscribeToSessionClaim,
} from "@/lib/services/session/session.service";

import { getInstallationId } from "@/lib/session";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let sessionUnsubscribe: Unsubscribe | null = null;

        function stopSessionMonitoring() {
            sessionUnsubscribe?.();
            sessionUnsubscribe = null;
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

                setUser(currentUser);
                setLoading(false);

                if (!currentUser) {
                    return;
                }

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
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
