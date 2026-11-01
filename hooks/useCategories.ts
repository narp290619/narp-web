"use client";

import { useEffect, useState } from "react";

import type { ParentCategory } from "@/lib/models/parent-category";
import { getAllCategories } from "@/repositories/category.repository";

export function useCategories() {
    const [categories, setCategories] = useState<ParentCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCategories()
            .then(setCategories)
            .catch((error) => {
                console.error("Failed to load categories:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    return {
        categories,
        loading,
    };
}