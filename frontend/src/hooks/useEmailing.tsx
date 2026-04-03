export interface EmailCampaignStub {
  id: string;
  name: string;
  sent_at?: string;
  status?: string;
  created_at?: string;
  total_recipients?: number;
  opened_count?: number;
  clicked_count?: number;
}

export function useEmailing() {
  return {
    campaigns: [] as EmailCampaignStub[],
    loading: false,
    refetch: async () => {},
  };
}
