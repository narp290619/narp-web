import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { SkillMember } from "@/lib/models/skill-member";

const COLLECTION = "SkillMembers";

export async function getSkillMembers(
    skillId: string,
): Promise<SkillMember[]> {

    const q = query(
        collection(db, COLLECTION),
        where("skillId", "==", skillId),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnapshot) => {

        const data = docSnapshot.data();

        return {

            id: docSnapshot.id,

            ...(data as Omit<SkillMember, "id">),

            createdAt:
                data.createdAt?.toMillis() ?? null,

            updatedLocationAt:
                data.updatedLocationAt?.toMillis() ?? null,

        };

    });

}

export async function getSkillMember(
    userId: string,
    skillId: string,
): Promise<SkillMember | null> {

    const id = `${userId}_${skillId}`;

    return getSkillMemberById(id);

}

export async function getSkillMemberById(
    id: string,
): Promise<SkillMember | null> {

    const snapshot = await getDoc(
        doc(db, COLLECTION, id),
    );

    if (!snapshot.exists()) {

        return null;

    }

    const data = snapshot.data();

    return {

        id: snapshot.id,

        ...(data as Omit<SkillMember, "id">),

        createdAt:
            data.createdAt?.toMillis() ?? null,

        updatedLocationAt:
            data.updatedLocationAt?.toMillis() ?? null,

    };

}

export async function getSimilarSkillMembers(
    skillId: string,
    excludeUserId: string,
    limitCount = 3,
): Promise<SkillMember[]> {

    const q = query(
        collection(db, COLLECTION),
        where("skillId", "==", skillId),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
        .map((docSnapshot) => {

            const data = docSnapshot.data();

            return {

                id: docSnapshot.id,

                ...(data as Omit<SkillMember, "id">),

                createdAt:
                    data.createdAt?.toMillis() ?? null,

                updatedLocationAt:
                    data.updatedLocationAt?.toMillis() ?? null,

            };

        })
        .filter(
            (member) =>
                member.userId !== excludeUserId,
        )
        .sort(
            (a, b) =>
                (b.rating ?? 0) -
                (a.rating ?? 0),
        )
        .slice(0, limitCount);

}