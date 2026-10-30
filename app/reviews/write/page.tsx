import type { Metadata } from "next";
import ReviewSubmissionClient from "./ReviewSubmissionClient";

export const metadata: Metadata = {
  title: "Rate NARP | Share Your Experience",
  description:
    "Share your experience as a NARP client or freelancer and help improve the marketplace.",
};

export default function ReviewSubmissionPage() {
  return <ReviewSubmissionClient />;
}
