export interface DashboardLayoutData {
  widgets: string[];
  layouts: {
    lg: Array<{ i: string; w: number; h: number; x: number; y: number }>;
  };
}

const EMPTY_LAYOUT: DashboardLayoutData = {
  widgets: [],
  layouts: { lg: [] },
};

export function useDashboardLayout() {
  return {
    layout: EMPTY_LAYOUT,
    isLoading: false,
    saveLayout: async () => {},
    refetch: async () => {},
  };
}
