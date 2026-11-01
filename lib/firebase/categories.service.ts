import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { ParentCategory } from "@/lib/models/parent-category";

const COLLECTION = "Categories";

export async function getCategories(): Promise<ParentCategory[]> {
    const q = query(
        collection(db, COLLECTION),
        where("isActive", "==", true),
        orderBy("sortOrder", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ParentCategory, "id">),
    }));
}