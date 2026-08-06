export const PAYMENT_STATUS = {
    PENDING: "payment_pending",
    PROCESSING: "processing",
    HELD: "held",
    RELEASED: "released",
    REFUNDED: "refunded",
} as const;

export type PaymentStatus =
    (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];