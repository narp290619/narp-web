"use client";

import { useCallback, useRef } from "react";

import Webcam from "react-webcam";

interface Props {

    disabled?: boolean;

    onCapture(
        image: string,
    ): void;

}

export default function FaceVerificationCamera({

    disabled = false,

    onCapture,

}: Props) {

    const webcamRef =
        useRef<Webcam>(null);

    const capture = useCallback(() => {

        if (disabled) {

            return;

        }

        const image =
            webcamRef.current?.getScreenshot();

        if (!image) {

            return;

        }

        onCapture(image);

    }, [

        disabled,

        onCapture,

    ]);

    return (

        <div
            className="
                flex
                flex-col
                items-center
                gap-6
            "
        >

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    shadow
                "
            >

                <Webcam

                    ref={webcamRef}

                    audio={false}

                    mirrored

                    screenshotFormat="image/jpeg"

                    videoConstraints={{

                        facingMode: "user",

                        width: 720,

                        height: 720,

                    }}

                    className="w-full"

                />

            </div>

            <button

                type="button"

                onClick={capture}

                disabled={disabled}

                className="
                    rounded-xl
                    bg-orange-500
                    px-8
                    py-3
                    font-semibold
                    text-white

                    transition

                    hover:bg-orange-600

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "

            >

                Capture Selfie

            </button>

        </div>

    );

}