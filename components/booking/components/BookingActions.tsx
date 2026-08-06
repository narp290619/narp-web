"use client";

import { useRouter } from "next/navigation";

import BookingActionsCard from "./BookingActionsCard";

import { Booking } from "@/lib/models/booking";

import { getBookingActions } from "@/components/maps/features/booking/services/booking-actions.service";
import { auth } from "@/lib/firebase";

interface Props {

    booking: Booking;

}

export default function BookingActions({

    booking,

}: Props) {

    const router = useRouter();

    const currentUserId =
        auth.currentUser?.uid ?? "";

    return (

        <BookingActionsCard

            actions={

                getBookingActions({

                    booking,

                    router,

                    currentUserId,

                })

            }

        />

    );

}

export interface BookingAction {

    id: string;

    label: string;

    onClick(): void | Promise<void>;

    icon?: React.ReactNode;

    variant?: "primary" | "secondary" | "danger";

    disabled?: boolean;

}