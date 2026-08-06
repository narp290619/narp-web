"use client";

import { useEffect, useState } from "react";

import { Skill } from "@/lib/models/skill";
import { getAllSkills } from "@/repositories/skill.repository";


export function useSkills() {

    const [skills, setSkills] = useState<Skill[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        getAllSkills()

            .then(setSkills)

            .finally(() => setLoading(false));

    }, []);

    return {

        skills,

        loading,

    };

}