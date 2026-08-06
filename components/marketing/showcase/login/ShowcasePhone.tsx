"use client";

import PhoneEngine from "./engine/PhoneEngine";

import SceneContainer from "./journey/SceneContainer";
import ProgressDots from "./journey/ProgressDots";

import useJourney from "./journey/useJourney";
import { journey } from "./journey/journey";

import AIScene from "./journey/scenes/AIScene";
import FaceScene from "./journey/scenes/FaceScene";
import TrackingScene from "./journey/scenes/TrackingScene";
import TimelineScene from "./journey/scenes/TimelineScene";
import PaymentScene from "./journey/scenes/PaymentScene";
import SuccessScene from "./journey/scenes/SuccessScene";

const scenes: Record<string, React.ComponentType> = {
    ai: AIScene,
    face: FaceScene,
    tracking: TrackingScene,
    timeline: TimelineScene,
    payment: PaymentScene,
    success: SuccessScene,
};

export default function ShowcasePhone() {
    const {

        index,

        scene,

        progress,

    } = useJourney();

    const ActiveScene = scenes[scene.id] ?? AIScene;

    return (
        <PhoneEngine
            scene={scene}
            progress={progress}
        >
            <SceneContainer sceneKey={scene.id}>
                <ActiveScene />
            </SceneContainer>

            <ProgressDots
                current={index}
                total={journey.length}
            />
        </PhoneEngine>
    );
}