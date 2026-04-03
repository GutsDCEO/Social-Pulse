import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Comment {
  id: string;
  publication_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

/** REST comments non exposés — stub pour compilation UI Lovable. */
export function useComments(publicationId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!publicationId) return;
    setLoading(true);
    setComments([]);
    setLoading(false);
  }, [publicationId]);

  const addComment = async (content: string) => {
    if (!user || !publicationId || !content.trim()) return null;
    const c: Comment = {
      id: crypto.randomUUID(),
      publication_id: publicationId,
      user_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, c]);
    return c;
  };

  const deleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    return true;
  };

  return { comments, loading, fetchComments, addComment, deleteComment };
}
