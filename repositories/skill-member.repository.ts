import {
    getSkillMembers,
    getSkillMember,
    getSkillMemberById,
    getSimilarSkillMembers,
} from "@/lib/firebase/skill-members.service";

import type { SkillMember } from "@/lib/models/skill-member";

export async function getMembersBySkill(
    skillId: string,
): Promise<SkillMember[]> {

    return getSkillMembers(skillId);

}

export async function getMember(
    userId: string,
    skillId: string,
): Promise<SkillMember | null> {

    return getSkillMember(
        userId,
        skillId,
    );

}

export async function getMemberById(
    id: string,
): Promise<SkillMember | null> {

    return getSkillMemberById(id);

}

export async function getSimilarMembers(
    skillId: string,
    excludeUserId: string,
): Promise<SkillMember[]> {

    return getSimilarSkillMembers(
        skillId,
        excludeUserId,
    );

}