export interface BlogArticleRow {
  id: string;
  title?: string | null;
  content?: string | null;
  scheduled_date: string;
  published_at?: string | null;
  status: 'brouillon' | 'publie' | string;
}

export function useBlogArticles() {
  return {
    articles: [] as BlogArticleRow[],
    loading: false,
    refetch: async () => {},
  };
}
