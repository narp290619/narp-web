import { JobRequestDraft } from "@/components/maps/features/booking/types/JobRequestDraft";
import { SkillMember } from "@/lib/models/skill-member";

export interface JobRequestSession {

    draft: JobRequestDraft;

    freelancer: SkillMember;

}

const STORAGE_KEY =
    "job-request-draft";

export function saveJobRequestDraft(
    session: JobRequestSession,
) {

    sessionStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(session),

    );

}

export function getJobRequestDraft():
    JobRequestSession | null {

    const json =
        sessionStorage.getItem(
            STORAGE_KEY,
        );

    if (!json) {

        return null;

    }

    return JSON.parse(json);

}

export function clearJobRequestDraft() {

    sessionStorage.removeItem(
        STORAGE_KEY,
    );

}