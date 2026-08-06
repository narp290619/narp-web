export const BOOKING_STATUS = {
    PENDING: "pending",
    VERIFIED: "verified",
    ACCEPTED: "accepted",
    TRAVELLING: "travelling",
    ARRIVED: "arrived",
    IN_PROGRESS: "in_progress",
    COMPLETION_REQUESTED: "completion_requested",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
} as const;

export type BookingStatus =
    (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const PAYMENT_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    HELD: "held",
    RELEASED: "released",
    REFUNDED: "refunded",
} as const;

export type PaymentStatus =
    (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];