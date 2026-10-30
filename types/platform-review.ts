
export type PlatformReviewRole = "client" | "freelancer";

export type PlatformReviewStatus = "published" | "hidden";

export interface PlatformReviewCategoryRatings {
  easeOfUse: number;
  platformExperience: number;
  paymentExperience: number;
  reliability: number;
  customerSupport: number;
}

export interface PlatformReview {
  id: string;
  userId: string;
  userName: string;
  userRole: PlatformReviewRole;
  rating: number;
  categoryRatings: PlatformReviewCategoryRatings;
  feedback?: string;
  status: PlatformReviewStatus;
  createdAt?: Date | string | { seconds: number; nanoseconds: number };
  moderatedAt?: Date | string | { seconds: number; nanoseconds: number };
  moderatedBy?: string;
}

export interface PlatformReviewStatistics {
  totalReviews: number;
  publishedReviews: number;
  ratingTotal: number;
  averageRating: number;
  ratingDistribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  categoryTotals: PlatformReviewCategoryRatings;
  categoryAverages: PlatformReviewCategoryRatings;
  updatedAt?: Date | string | { seconds: number; nanoseconds: number };
}

export interface PlatformReviewEligibilityItem {
  eligible: boolean;
  canReview: boolean;
  alreadyReviewed: boolean;
  reason?: string | null;
  review?: PlatformReview | null;
}

export interface PlatformReviewEligibility {
  client: PlatformReviewEligibilityItem;
  freelancer: PlatformReviewEligibilityItem;
}

export interface GetPlatformReviewsRequest {
  limit?: number;
  role?: PlatformReviewRole;
  lastDocumentId?: string | null;
}

export interface GetPlatformReviewsResponse {
  success: boolean;
  reviews: PlatformReview[];
  lastDocumentId: string | null;
  hasMore: boolean;
}

export interface GetPlatformReviewStatisticsResponse
  extends PlatformReviewStatistics {
  success: boolean;
  clientStatistics: PlatformReviewStatistics;
  freelancerStatistics: PlatformReviewStatistics;
}

export interface SubmitPlatformReviewRequest {
  userRole: PlatformReviewRole;
  rating: number;
  categoryRatings: PlatformReviewCategoryRatings;
  feedback?: string;
}

export interface SubmitPlatformReviewResponse {
  success: boolean;
  message: string;
  reviewId: string;
  userRole: PlatformReviewRole;
  totalReviews: number;
  publishedReviews: number;
  averageRating: number;
}

export interface ModeratePlatformReviewRequest {
  reviewId: string;
  status: PlatformReviewStatus;
}

export interface ModeratePlatformReviewResponse {
  success: boolean;
  message: string;
  changed: boolean;
  status: PlatformReviewStatus;
  publishedReviews: number;
  averageRating: number;
}
