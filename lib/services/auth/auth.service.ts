import {

    signInWithEmailAndPassword,

    signOut,

    User,

} from "firebase/auth";

import { auth } from "@/lib/firebase";

export async function login(

    email: string,

    password: string

): Promise<User> {

    const credential =
        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

    return credential.user;

}

export async function logout() {

    await signOut(auth);

}

export function currentUser() {

    return auth.currentUser;

}