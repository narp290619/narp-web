export interface SkillMember {
    id: string;

    userId: string;
    skillId: string;

    firstName: string;
    lastName: string;

    profileImageUrl: string;
    skillSamplePhotoUrl: string;

    portfolioImages?: string[];

    aboutMemberSkill: string;

    startingPrice: number;

    rating: number;
    rating1?: number;
    rating2?: number;
    rating3?: number;
    rating4?: number;
    rating5?: number;

    reviewCount: number;
    completedJobs?: number;

    isVerified: boolean;

    latitude: number;
    longitude: number;

    serviceRadiusKm?: number;

    popularityScore?: number;
    rankingScore?: number;

    createdAt?: number | null;
    updatedLocationAt?: number | null;
}