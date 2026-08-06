"use client";

import { philippinesNodes } from "./philippinesNodes";
import NetworkPulse from "./NetworkPulse";

const paths = [

    "M52 28 L63 52",

    "M63 52 L73 80",

    "M52 28 L47 14",

    "M52 28 L26 58",

    "M63 52 L55 56",

    "M63 52 L77 36",

];

export default function NetworkBackground() {

    return (

        <svg

            className="absolute inset-0 h-full w-full"

            viewBox="0 0 100 100"

            preserveAspectRatio="none"

        >

            <defs>

                <filter id="pulseGlow">

                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />

                    <feMerge>

                        <feMergeNode in="coloredBlur" />

                        <feMergeNode in="SourceGraphic" />

                    </feMerge>

                </filter>

            </defs>

            {paths.map((path) => (

                <path

                    key={path}

                    d={path}

                    stroke="rgba(255,255,255,.15)"

                    strokeWidth="0.35"

                    fill="none"

                />

            ))}

            {paths.map((path, index) => (

                <NetworkPulse

                    key={index}

                    path={path}

                    delay={index * .8}

                />

            ))}

            {philippinesNodes.map((node) => (

                <g

                    key={node.id}

                    transform={`translate(${node.x} ${node.y})`}

                >

                    <circle

                        r="1.6"

                        fill="#ffffff"

                    />

                    <circle

                        r="3"

                        fill="#fb923c"

                        opacity=".25"

                    />

                </g>

            ))}

        </svg>

    );

}