
import type { Metadata } from "next";
import ReviewsPageClient from "./ReviewsPageClient";

export const metadata: Metadata = {
  title: "NARP Reviews | What Our Community Says",
  description:
    "Discover what clients and freelancers say about their experience using NARP.",
};

export default function ReviewsPage() {
  return <ReviewsPageClient />;
}
