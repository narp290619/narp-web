"use client";

import { JourneyScene } from "../journey/types";
import useJourney from "../journey/useJourney";
import FloatingPhone from "./FloatingPhone";

import Glow from "./Glow";
import JourneyAssistant from "./JourneyAssistant";
import JourneyProgress from "./JourneyProgress";
import PersistentBottomNav from "./PersistentBottomNav";
import PersistentStatusBar from "./PersistentStatusBar";

import Reflection from "./Reflection";
import SceneHeader from "./SceneHeader";

interface PhoneEngineProps {

    children: React.ReactNode;

    scene: JourneyScene;

    progress: number;
}

export default function PhoneEngine({

    children,
    scene,
    progress,

}: PhoneEngineProps) {



    return (

        <div className="relative">

            <Glow />

            <FloatingPhone>

                <div

                    className="
                        relative
                        h-[640px]
                        w-[315px]
                        rounded-[58px]
                        border-[12px]
                        border-neutral-900
                        bg-neutral-900
                        shadow-[0_50px_100px_rgba(0,0,0,.35)]
                    "

                >

                    <div

                        className="
                            absolute
                            inset-[8px]
                            overflow-hidden
                            rounded-[44px]
                            bg-white
                        "

                    >

                        <PersistentStatusBar />

                        <JourneyProgress
                            progress={progress}
                        />

                        <JourneyAssistant

                            messages={scene.assistantMessages}

                        />

                        <SceneHeader
                            scene={scene}
                        />

                        <div
                            className="
                                px-6
                                pt-6
                            "
                        >

                            {children}

                        </div>

                        <PersistentBottomNav />

                        <Reflection />

                    </div>

                </div>

            </FloatingPhone>

        </div>

    );

}