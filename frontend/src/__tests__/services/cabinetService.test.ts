// ============================================================
// TDD: cabinet REST helpers (assign user).
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  default: { post: mockPost },
}));

import { assignUserToCabinet } from '../../services/cabinetService';

describe('cabinetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('assignUserToCabinet posts AssignUserRequest to cabinet assign endpoint', async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await assignUserToCabinet('cab-uuid', { userId: 'user-uuid', role: 'CM' });

    expect(mockPost).toHaveBeenCalledWith('/v1/cabinets/cab-uuid/assign', {
      userId: 'user-uuid',
      role: 'CM',
    });
  });
});
