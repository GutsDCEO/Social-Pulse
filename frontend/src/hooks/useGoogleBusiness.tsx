export interface GoogleReviewStub {
  id: string;
  rating: number;
  text?: string | null;
  created_at?: string;
  star_rating?: number;
  comment?: string | null;
  reviewer_name?: string | null;
  create_time?: string;
  review_reply?: string | null;
}

export function useGoogleBusiness() {
  return {
    reviews: [] as GoogleReviewStub[],
    loading: false,
    useDemoData: true,
    refetch: async () => {},
  };
}
