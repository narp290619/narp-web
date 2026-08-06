import {
  getSkills,
  getSkillBySlug,
} from "@/lib/firebase/skills.service";

import type { Skill } from "@/lib/models/skill";

export async function getAllSkills(): Promise<Skill[]> {
  return getSkills();
}

export async function getSkill(
    slug: string
): Promise<Skill | null> {
    return getSkillBySlug(slug);
}