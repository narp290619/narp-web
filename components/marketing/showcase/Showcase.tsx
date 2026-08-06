"use client";

import { AnimatePresence, motion } from "framer-motion";

import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import ShowcaseTabs from "./ShowcaseTabs";
import ShowcasePhone from "./ShowcasePhone";
import ShowcaseProgress from "./ShowcaseProgress";

import { showcaseData } from "./showcaseData";
import { useShowcase } from "./useShowcase";
import FadeUp from "@/components/animations/FadeUp";
import FloatingPhone from "./FloatingPhone";
import FeatureBubble from "./FeatureBubble";
import { CreditCard, MapPinned, MessageCircle, Star } from "lucide-react";

export default function Showcase() {
    const {
        active,
        setPaused,
        goTo,
        goToNext,
        goToPrevious,
    } = useShowcase();

    return (
        <section
            id="features"
            className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50 to-slate-50 py-28"
        >
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

            <Container>
                <FadeUp>
                    <SectionTitle
                        badge="App Experience"
                        title="Everything You Need in One App"
                        subtitle="Discover professionals, chat, book services, pay securely, and track every job with NARP."
                    />

                    <ShowcaseTabs
                        items={showcaseData}
                        active={active.id}
                        // onChange={(id: string) => {
                        //     const selected = showcaseData.find(
                        //         (item) => item.id === id
                        //     );

                        //     if (selected) {
                        //         setActive(selected);
                        //     }
                        // }}
                        onChange={goTo}
                    />

                    {/* <div className="mx-auto mt-8 h-1 max-w-xl overflow-hidden rounded-full bg-slate-200">

                        <motion.div
                            key={active.id}
                            className="h-full rounded-full bg-orange-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 5,
                                ease: "linear",
                            }}
                        />

                    </div> */}
                    <ShowcaseProgress
                        // items={showcaseData}
                        // active={active.id}
                        // onSelect={(id: string) => {

                        //     const selected = showcaseData.find(
                        //         item => item.id === id
                        //     );

                        //     if (selected) {

                        //         setActive(selected);

                        //     }

                        // }}
                        items={showcaseData}
                        active={active.id}
                        onSelect={goTo}
                    />

                    <div
                        className="mt-16 grid items-center gap-16 lg:grid-cols-2"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >

                        {/* <div>
                            <h3 className="text-4xl font-bold">
                                {active.title}
                            </h3>

                            <p className="mt-6 text-lg text-slate-600 leading-8">
                                {active.description}
                            </p>
                        </div> */}
                        <AnimatePresence mode="wait">

                            <motion.div
                                key={active.id}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -30,
                                }}
                                transition={{
                                    duration: 0.4,
                                }}
                            >

                                <h3 className="text-4xl font-bold">
                                    {active.title}
                                </h3>

                                <p className="mt-6 text-lg leading-8 text-slate-600">
                                    {active.description}
                                </p>

                            </motion.div>

                        </AnimatePresence>

                        <div className="relative">

                            <div className="
                                absolute
                                inset-0
                                rounded-full
                                bg-blue-300/15
                                blur-2xl
                                scale-100
                            " />

                            <ShowcasePhone
                                image={active.image}
                                onNext={goToNext}
                                onPrevious={goToPrevious}
                            />

                        </div>

                    </div>
                </FadeUp>

                <div className="relative mt-24 flex h-[700px] items-center justify-center">

                    <FloatingPhone
                        image="/images/app/welcome.png"
                        className="-rotate-12 -translate-x-44"
                        delay="0s"
                    />

                    <FloatingPhone
                        image="/images/app/home-screen.png"
                        delay="1.2s"
                    />

                    <FloatingPhone
                        image="/images/app/splash.png"
                        className="rotate-12 translate-x-44"
                        delay="2.4s"
                    />

                    <FeatureBubble
                        icon={MapPinned}
                        title="Nearby Professionals"
                        className="absolute left-0 top-12"
                    />

                    <FeatureBubble
                        icon={MessageCircle}
                        title="Chat & Booking"
                        className="absolute right-0 top-20"
                    />

                    <FeatureBubble
                        icon={Star}
                        title="Ratings & Reviews"
                        className="absolute left-12 bottom-20"
                    />

                    <FeatureBubble
                        icon={CreditCard}
                        title="Secure Payments"
                        className="absolute right-10 bottom-12"
                    />

                </div>

            </Container>

        </section>
    )
}