"use client";

import { useEffect, useState } from "react";

import { SkillMember } from "@/lib/models/skill-member";
import { getMemberById } from "@/repositories/skill-member.repository";



interface UseMemberResult {

    member: SkillMember | null;

    loading: boolean;

}

export function useMember(
    memberId: string,
): UseMemberResult {

    const [member, setMember] =
        useState<SkillMember | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function load() {

            try {

                const data =
                    await getMemberById(memberId);

                setMember(data);

            } finally {

                setLoading(false);

            }

        }

        if (memberId) {

            load();

        }

    }, [memberId]);

    return {

        member,

        loading,

    };

}