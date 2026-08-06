import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AppUser {

    id: string;

    firstName: string;

    lastName: string;

    profileImageUrl?: string;

    isVerified: boolean;

}

export async function getUserById(
    userId: string,
): Promise<AppUser | null> {

    const snapshot = await getDoc(
        doc(db, "Users", userId),
    );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<AppUser, "id">),
    };
}