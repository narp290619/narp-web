"use client";

import { useEffect, useMemo, useState } from "react";

import BookingStepper from "./BookingStepper";

import BookingScheduleStep from "./steps/BookingScheduleStep";
import BookingDescriptionStep from "./steps/BookingDescriptionStep";
import BookingReviewStep from "./steps/BookingReviewStep";

import GoogleMapsProvider from "@/components/maps/providers/GoogleMapsProvider";
import LocationPicker from "@/components/maps/pickers/LocationPicker";
import { JobRequestDraft } from "../maps/features/booking/types/JobRequestDraft";
import { validateStep } from "../maps/features/booking/validation/booking.validator";
import { SkillMember } from "@/lib/models/skill-member";
import {
    validateServiceArea,
    getServiceArea,
} from "../maps/services/service-area.service";

import ServiceAreaBadge from "../maps/features/ServiceAreaBadge";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { saveJobRequestDraft } from "@/lib/session/jobRequestDraft";
import BookingHeader from "./BookingHeader";
import BookingStepRenderer from "./BookingStepRenderer";
import BookingValidationBanner from "./BookingValidationBanner";
import BookingFooter from "./BookingFooter";


interface Props {
    freelancer: SkillMember;
}

export default function BookingWizard({
    freelancer,
}: Props) {

    const { user, loading } = useAuthContext();

    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.replace(
                `/login?redirect=${encodeURIComponent(window.location.pathname)}`
            );
        }
    }, [user, router]);

    const [step, setStep] = useState(0);

    const [

        jobRequest,

        setJobRequest,

    ] = useState<JobRequestDraft>({

        schedule: {

            date: "",

            time: "",

        },

        location: {

            latitude: 14.5995,

            longitude: 120.9842,

        },

        description: "",

    });

    const validation = useMemo(

        () => validateStep(
            step,
            jobRequest,
        ),

        [step, jobRequest],

    );

    function nextStep() {

        if (!validation.valid) {
            return;
        }

        setStep((previous) =>
            Math.min(previous + 1, 3),
        );

    }

    function previousStep() {

        setStep((previous) =>
            Math.max(previous - 1, 0),
        );

    }

    // function renderStep() {

    //     switch (step) {

    //         case 0:

    //             return (

    //                 <BookingScheduleStep

    //                     date={jobRequest.schedule.date}

    //                     time={jobRequest.schedule.time}

    //                     onDateChange={(date) =>

    //                         setJobRequest((previous) => ({

    //                             ...previous,

    //                             schedule: {

    //                                 ...previous.schedule,

    //                                 date,

    //                             },

    //                         }))

    //                     }

    //                     onTimeChange={(time) =>

    //                         setJobRequest((previous) => ({

    //                             ...previous,

    //                             schedule: {

    //                                 ...previous.schedule,

    //                                 time,

    //                             },

    //                         }))

    //                     }

    //                 />

    //             );

    //         case 1:

    //             return (

    //                 <GoogleMapsProvider>

    //                     <LocationPicker

    //                         value={jobRequest.location}

    //                         onChange={(location) =>

    //                             setJobRequest((previous) => ({

    //                                 ...previous,

    //                                 location,

    //                             }))

    //                         }

    //                     />

    //                     <ServiceAreaBadge
    //                         withinArea={serviceAreaResult.withinArea}
    //                         distanceKm={serviceAreaResult.distanceKm}
    //                         radiusKm={freelancer.serviceRadiusKm ?? 10}
    //                     />

    //                 </GoogleMapsProvider>

    //             );

    //         case 2:

    //             return (

    //                 <BookingDescriptionStep

    //                     description={jobRequest.description}

    //                     onDescriptionChange={(description) =>

    //                         setJobRequest((previous) => ({

    //                             ...previous,

    //                             description,

    //                         }))

    //                     }

    //                 />

    //             );

    //         case 3:

    //             return (

    //                 // <BookingReviewStep

    //                 //     date={booking.schedule.date}

    //                 //     time={booking.schedule.time}

    //                 //     address={
    //                 //         booking.location.address ?? ""
    //                 //     }

    //                 //     description={booking.description}

    //                 // />

    //                 <BookingReviewStep
    //                     booking={jobRequest}
    //                     member={freelancer}
    //                 />

    //             );

    //         default:

    //             return null;

    //     }

    // }

    const serviceAreaResult =
        validateServiceArea(
            jobRequest.location,
            getServiceArea(freelancer),
        );

    const canContinue =
        validation.valid &&
        (
            step !== 1 ||
            serviceAreaResult.withinArea
        );

    console.log({
        loading,
        user,
    });

    console.log(user?.uid);
    console.log(user?.email);

    if (loading) {

        return (

            <div
                className="
                rounded-3xl
                border
                bg-white
                p-8
                text-center
            "
            >
                Checking login...
            </div>

        );

    }

    return (

        <section
            className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
        >

            <BookingHeader

                freelancer={freelancer}

            />

            <div className="mt-10">

                <BookingStepper
                    currentStep={step}
                />

            </div>

            <div className="mt-10">

                <BookingStepRenderer

                    step={step}

                    booking={jobRequest}

                    setBooking={setJobRequest}

                    freelancer={freelancer}

                />

            </div>

            {/* {!validation.valid ? (

                <div
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-600
                    "
                >
                    {validation.message}
                </div>

            ) : (

                step === 1 &&
                !serviceAreaResult.withinArea && (

                    <div
                        className="
                            mt-6
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        "
                    >
                        This location is outside the freelancer's service area.
                        Please choose a nearer location.
                    </div>

                )

            )} */}

            <BookingValidationBanner

                validation={validation}

                step={step}

                withinServiceArea={
                    serviceAreaResult.withinArea
                }

            />

            {/* <div
                className="
                    mt-12
                    flex
                    items-center
                    justify-between
                "
            >

                <button

                    type="button"

                    onClick={previousStep}

                    disabled={step === 0}

                    className="
                        rounded-xl
                        border
                        px-6
                        py-3
                        font-semibold
                        transition

                        disabled:cursor-not-allowed
                        disabled:opacity-40

                        hover:bg-slate-100
                    "

                >

                    Back

                </button>

                {step < 3 ? (

                    <button

                        type="button"

                        onClick={nextStep}

                        disabled={!canContinue}

                        className="
                            rounded-xl
                            bg-orange-500
                            px-8
                            py-3
                            font-semibold
                            text-white
                            transition

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            hover:bg-orange-600
                        "

                    >

                        Continue

                    </button>

                ) : (

                    <button

                        type="button"

                        onClick={async () => {

                            if (!user) {

                                alert("Please sign in first.");

                                return;

                            }

                            try {

                                // const bookingRef =
                                //     await createBooking({

                                //         booking,

                                //         freelancer,

                                //     });

                                // router.push(
                                //     `/bookings/${bookingRef.id}`
                                // );

                                saveJobRequestDraft({

                                    draft: jobRequest,

                                    freelancer,

                                });

                                router.push("/face-verification");


                            }

                            catch (error) {

                                console.error(error);

                                alert(
                                    "Unable to create booking.",
                                );

                            }

                        }}

                        className="
                            rounded-xl
                            bg-green-600
                            px-8
                            py-3
                            font-semibold
                            text-white
                            transition

                            hover:bg-green-700
                        "

                    >

                        Continue to Face Verification

                    </button>

                )}

            </div> */}

            <BookingFooter

                step={step}

                canContinue={canContinue}

                onBack={previousStep}

                onContinue={nextStep}

                onFinish={async () => {

                    if (!user) {

                        alert("Please sign in first.");

                        return;

                    }

                    try {

                        saveJobRequestDraft({

                            draft: jobRequest,

                            freelancer,

                        });

                        router.push("/face-verification");

                    }

                    catch (error) {

                        console.error(error);

                        alert("Unable to create booking.");

                    }

                }}

            />

        </section>

    );

}
