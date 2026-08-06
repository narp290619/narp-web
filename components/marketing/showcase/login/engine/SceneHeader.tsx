"use client";

import SceneIcon from "./SceneIcon";
import { JourneyScene } from "../journey/types";

interface Props {
    scene: JourneyScene;
}

export default function SceneHeader({
    scene,
}: Props) {
    return (
        <div className="flex items-center gap-4 px-6 pt-5">

            <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                    backgroundColor: `${scene.accentColor}20`,
                }}
            >
                <SceneIcon
                    icon={scene.icon}
                    color={scene.accentColor}
                />
            </div>

            <div>

                <h2 className="text-xl font-bold">
                    {scene.title}
                </h2>

                <p className="text-sm text-slate-500">
                    {scene.subtitle}
                </p>

            </div>

        </div>
    );
}