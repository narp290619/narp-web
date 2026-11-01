import { getCategories as fetchCategories } from "@/lib/firebase/categories.service";

import type { ParentCategory } from "@/lib/models/parent-category";

export async function getAllCategories(): Promise<ParentCategory[]> {
    return fetchCategories();
}