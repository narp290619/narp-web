"use client";

export default function MemberAvatars() {
    return (
        <div className="flex -space-x-2">
            {[1, 2, 3].map((avatar) => (
                <div
                    key={avatar}
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-white
                        bg-orange-500
                        text-xs
                        font-bold
                        text-white
                    "
                >
                    {avatar}
                </div>
            ))}
        </div>
    );
}