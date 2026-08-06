"use client";

import { useEffect, useState } from "react";

import PhoneFrame from "./PhoneFrame";
import PhoneScreen from "./PhoneScreen";
import { screens } from "./screens";

export default function AnimatedPhone() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % screens.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const screen = screens[index];

  return (
    <PhoneFrame>
      <PhoneScreen screenKey={screen.id}>
        <div
          className={`flex h-full flex-col items-center justify-center ${screen.color} text-white`}
        >
          <div className="text-7xl">
            {screen.emoji}
          </div>

          <h2 className="mt-8 text-3xl font-bold">
            {screen.title}
          </h2>

          <p className="mt-4 text-lg opacity-90">
            {screen.subtitle}
          </p>
        </div>
      </PhoneScreen>
    </PhoneFrame>
  );
}