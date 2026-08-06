import { BookingStatus } from "@/lib/models/booking";

export interface TrackingStatusInfo {

    icon: string;

    title: string;

    color: string;

    badgeLabel: string;

    badgeVariant:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";

}

export function getTrackingStatusInfo(
    status: BookingStatus,
): TrackingStatusInfo {

    switch (status) {

        case "accepted":

            return {

                icon: "🤝",

                title: "Your booking has been accepted",

                color: "text-green-600",

                badgeLabel: "ACCEPTED",

                badgeVariant: "success",

            };

        case "travelling":

            return {

                icon: "🚗",

                title: "Your freelancer is on the way",

                color: "text-blue-600",

                badgeLabel: "ON THE WAY",

                badgeVariant: "info",

            };

        case "arrived":

            return {

                icon: "📍",

                title: "Your freelancer has arrived",

                color: "text-green-600",

                badgeLabel: "ARRIVED",

                badgeVariant: "success",

            };

        case "in_progress":

            return {

                icon: "🛠",

                title: "Your service is in progress",

                color: "text-amber-600",

                badgeLabel: "WORKING",

                badgeVariant: "warning",

            };

        case "completion_requested":

            return {

                icon: "⏳",

                title: "Waiting for your confirmation",

                color: "text-amber-600",

                badgeLabel: "WAITING FOR CONFIRMATION",

                badgeVariant: "warning",

            };

        case "completed":

            return {

                icon: "✅",

                title: "Your service is complete",

                color: "text-green-700",

                badgeLabel: "COMPLETED",

                badgeVariant: "success",

            };

        case "cancelled":

            return {

                icon: "❌",

                title: "Booking has been cancelled",

                color: "text-red-600",

                badgeLabel: "CANCELLED",

                badgeVariant: "danger",

            };

        case "expired":

            return {

                icon: "⌛",

                title: "Booking has expired",

                color: "text-slate-600",

                badgeLabel: "EXPIRED",

                badgeVariant: "neutral",

            };

        default:

            return {

                icon: "ℹ️",

                title: "Booking status updated",

                color: "text-slate-600",

                badgeLabel: "BOOKING",

                badgeVariant: "neutral",

            };

    }

}