"use client";

import BookingScheduleStep from "./steps/BookingScheduleStep";
import BookingDescriptionStep from "./steps/BookingDescriptionStep";
import BookingReviewStep from "./steps/BookingReviewStep";

import GoogleMapsProvider from "@/components/maps/providers/GoogleMapsProvider";
import LocationPicker from "@/components/maps/pickers/LocationPicker";

import ServiceAreaBadge
    from "../maps/features/ServiceAreaBadge";

import {
    getServiceArea,
    validateServiceArea,
} from "../maps/services/service-area.service";

import type { SkillMember } from "@/lib/models/skill-member";
import type { JobRequestDraft } from "../maps/features/booking/types/JobRequestDraft";

interface Props {

    step: number;

    booking: JobRequestDraft;

    setBooking: React.Dispatch<React.SetStateAction<JobRequestDraft>>;

    freelancer: SkillMember;

}

export default function BookingStepRenderer({

    step,

    booking,

    setBooking,

    freelancer,

}: Props) {

    const serviceAreaResult =
        validateServiceArea(

            booking.location,

            getServiceArea(freelancer),

        );

    switch (step) {

        case 0:

            return (

                <BookingScheduleStep

                    date={booking.schedule.date}

                    time={booking.schedule.time}

                    onDateChange={(date) =>

                        setBooking((previous) => ({

                            ...previous,

                            schedule: {

                                ...previous.schedule,

                                date,

                            },

                        }))

                    }

                    onTimeChange={(time) =>

                        setBooking((previous) => ({

                            ...previous,

                            schedule: {

                                ...previous.schedule,

                                time,

                            },

                        }))

                    }

                />

            );

        case 1:

            return (

                <GoogleMapsProvider>

                    <LocationPicker

                        value={booking.location}

                        onChange={(location) =>

                            setBooking((previous) => ({

                                ...previous,

                                location,

                            }))

                        }

                    />

                    <ServiceAreaBadge

                        withinArea={serviceAreaResult.withinArea}

                        distanceKm={serviceAreaResult.distanceKm}

                        radiusKm={freelancer.serviceRadiusKm ?? 10}

                    />

                </GoogleMapsProvider>

            );

        case 2:

            return (

                <BookingDescriptionStep

                    description={booking.description}

                    onDescriptionChange={(description) =>

                        setBooking((previous) => ({

                            ...previous,

                            description,

                        }))

                    }

                />

            );

        case 3:

            return (

                <BookingReviewStep

                    booking={booking}

                    member={freelancer}

                />

            );

        default:

            return null;

    }

}