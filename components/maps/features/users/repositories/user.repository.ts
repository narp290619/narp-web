import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { User } from "@/lib/models/user";

export async function getUser(

    userId: string,

): Promise<User | null> {

    const snapshot = await getDoc(

        doc(
            db,
            "Users",
            userId,
        ),

    );

    if (!snapshot.exists()) {

        return null;

    }

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<User, "id">),

    };

}