
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

import type {
  GetPlatformReviewStatisticsResponse,
  GetPlatformReviewsRequest,
  GetPlatformReviewsResponse,
  ModeratePlatformReviewRequest,
  ModeratePlatformReviewResponse,
  PlatformReviewEligibility,
  PlatformReviewRole,
  SubmitPlatformReviewRequest,
  SubmitPlatformReviewResponse,
} from "@/types/platform-review";

const getEligibilityCallable = httpsCallable<
  void,
  PlatformReviewEligibility
>(functions, "getPlatformReviewEligibility");

const submitReviewCallable = httpsCallable<
  SubmitPlatformReviewRequest,
  SubmitPlatformReviewResponse
>(functions, "submitPlatformReview");

const getReviewsCallable = httpsCallable<
  GetPlatformReviewsRequest,
  GetPlatformReviewsResponse
>(functions, "getPlatformReviews");

const getStatisticsCallable = httpsCallable<
  void,
  GetPlatformReviewStatisticsResponse
>(functions, "getPlatformReviewStatistics");

const getAdminReviewsCallable = httpsCallable<
  GetPlatformReviewsRequest,
  GetPlatformReviewsResponse
>(functions, "getPlatformReviewsForAdmin");

const moderateReviewCallable = httpsCallable<
  ModeratePlatformReviewRequest,
  ModeratePlatformReviewResponse
>(functions, "moderatePlatformReview");

export const platformReviewService = {
  async getEligibility(): Promise<PlatformReviewEligibility> {
    const result = await getEligibilityCallable();
    return result.data;
  },

  async submitReview(
    request: SubmitPlatformReviewRequest
  ): Promise<SubmitPlatformReviewResponse> {
    const result = await submitReviewCallable(request);
    return result.data;
  },

  async getReviews(
    request: GetPlatformReviewsRequest = {}
  ): Promise<GetPlatformReviewsResponse> {
    const result = await getReviewsCallable(request);
    return result.data;
  },

  async getStatistics(): Promise<GetPlatformReviewStatisticsResponse> {
    const result = await getStatisticsCallable();
    return result.data;
  },

  async getAdminReviews(
    request: GetPlatformReviewsRequest = {}
  ): Promise<GetPlatformReviewsResponse> {
    const result = await getAdminReviewsCallable(request);
    return result.data;
  },

  async moderateReview(
    request: ModeratePlatformReviewRequest
  ): Promise<ModeratePlatformReviewResponse> {
    const result = await moderateReviewCallable(request);
    return result.data;
  },
};

export type { PlatformReviewRole };
