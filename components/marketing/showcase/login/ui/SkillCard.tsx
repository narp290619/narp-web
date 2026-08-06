"use client";

import RatingStars from "./RatingStars";
import CategoryBadge from "./CategoryBadge";
import MemberAvatars from "./MemberAvatars";

interface Props {
    title: string;
    members: string;
    rating: number;
    badge: string;
    badgeColor: string;
}

export default function SkillCard({
    title,
    members,
    rating,
    badge,
    badgeColor,
}: Props) {
    return (
        <div
            className="
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-lg
                ring-1
                ring-slate-100
            "
        >
            <div className="h-24 bg-gradient-to-r from-orange-500 to-orange-300" />

            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold">
                            {title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            {members}
                        </p>
                    </div>

                    <CategoryBadge
                        label={badge}
                        color={badgeColor}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <MemberAvatars />

                    <RatingStars rating={rating} />
                </div>
            </div>
        </div>
    );
}