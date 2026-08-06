import {
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { Skill } from "@/lib/models/skill";

const COLLECTION = "Skills";

export async function getSkills(): Promise<Skill[]> {

    const q = query(

        collection(db, COLLECTION),

        orderBy("title")

    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({

        id: doc.id,

        ...(doc.data() as Omit<Skill, "id">),

    }));

}

import {
    where,
    limit,
} from "firebase/firestore";

export async function getSkillBySlug(
    slug: string
): Promise<Skill | null> {

    const q = query(
        collection(db, COLLECTION),
        where("slug", "==", slug),
        limit(1),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];

    return {
        id: doc.id,
        ...(doc.data() as Omit<Skill, "id">),
    };
}