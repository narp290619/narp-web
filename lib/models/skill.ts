export interface Skill {

    id: string;

    title: string;

    slug: string;

    description?: string;

    image: string;

    skillSampleImage: string;

    totalMembers: number;

    averageRating?: number;

    featured?: boolean;

    accentColor?: string;

    category: string;

}