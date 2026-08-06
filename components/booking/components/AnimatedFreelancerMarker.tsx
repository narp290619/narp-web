"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

interface Props {
    position: {
        lat: number;
        lng: number;
    };
}

export default function AnimatedFreelancerMarker({
    position,
}: Props) {

    const [animatedPosition, setAnimatedPosition] =
        useState(position);

    const animationRef =
        useRef<number | null>(null);

    useEffect(() => {

        const start = animatedPosition;
        const end = position;

        let startTime = 0;

        const duration = 800;

        const animate = (time: number) => {

            if (!startTime) {
                startTime = time;
            }

            const progress = Math.min(
                (time - startTime) / duration,
                1,
            );

            setAnimatedPosition({

                lat:
                    start.lat +
                    (end.lat - start.lat) * progress,

                lng:
                    start.lng +
                    (end.lng - start.lng) * progress,

            });

            if (progress < 1) {

                animationRef.current =
                    requestAnimationFrame(animate);

            }

        };

        animationRef.current =
            requestAnimationFrame(animate);

        return () => {

            if (animationRef.current !== null) {

                cancelAnimationFrame(
                    animationRef.current,
                );

            }

        };

    }, [position]);

    return (

        <AdvancedMarker
            position={animatedPosition}
        >

            <div className="text-3xl">

                🚗

            </div>

        </AdvancedMarker>

    );

}


// "use client";

// import { AdvancedMarker } from "@vis.gl/react-google-maps";

// interface LatLng {

//     lat: number;

//     lng: number;

// }

// interface Props {

//     position: LatLng;

// }

// export default function AnimatedFreelancerMarker({

//     position,

// }: Props) {

//     return (

//         <AdvancedMarker
//             position={position}
//         >

//             <div
//                 className="
//                     flex
//                     h-10
//                     w-10
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-blue-600
//                     text-white
//                     shadow-lg
//                 "
//             >

//                 🚗

//             </div>

//         </AdvancedMarker>

//     );

// }