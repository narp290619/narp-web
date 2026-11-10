// import {

//     signInWithEmailAndPassword,

//     signOut,

//     User,

// } from "firebase/auth";

// import { auth } from "@/lib/firebase";

// export async function login(

//     email: string,

//     password: string

// ): Promise<User> {

//     const credential =
//         await signInWithEmailAndPassword(

//             auth,

//             email,

//             password

//         );

//     return credential.user;

// }

// export async function logout() {

//     await signOut(auth);

// }

// export function currentUser() {

//     return auth.currentUser;

// }



import {
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
    beginSessionClaim,
    finishSessionClaim,
    claimWebAdminSession,
    releaseWebAdminSession,
} from "@/lib/services/session/session.service";

export async function login(
    email: string,
    password: string
): Promise<User> {
    beginSessionClaim();

    let authenticatedUser: User | null = null;

    try {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        authenticatedUser = credential.user;

        await claimWebAdminSession(credential.user.uid);

        return credential.user;
    } catch (error) {
        if (authenticatedUser) {
            try {
                await signOut(auth);
            } catch (signOutError) {
                console.error(
                    "FAILED TO SIGN OUT AFTER LOGIN FAILURE:",
                    signOutError
                );
            }
        }

        throw error;
    } finally {
        finishSessionClaim();
    }
}

export async function logout(): Promise<void> {
    try {
        await releaseWebAdminSession();
    } catch (error) {
        console.error(
            "FAILED TO RELEASE WEB SESSION:",
            error
        );
    } finally {
        await signOut(auth);
    }
}