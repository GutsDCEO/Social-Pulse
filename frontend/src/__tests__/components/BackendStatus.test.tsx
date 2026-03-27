import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BackendStatus from '../../components/BackendStatus';
import api from '../../services/api';

// Mock the API service
vi.mock('../../services/api');

describe('BackendStatus Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    // Mock a pending promise
    (api.get as any).mockReturnValue(new Promise(() => {}));
    
    render(<BackendStatus />);
    expect(screen.getByText(/Checking backend.../i)).toBeInTheDocument();
  });

  it('should show online state when backend returns UP', async () => {
    (api.get as any).mockResolvedValue({
      data: { status: 'UP' }
    });

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByText(/Backend Online/i)).toBeInTheDocument();
    });
  });

  it('should show offline state when backend returns error', async () => {
    (api.get as any).mockRejectedValue(new Error('Connection failed'));

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByText(/Backend Offline/i)).toBeInTheDocument();
    });
  });

  it('should show offline state when backend returns non-UP status', async () => {
    (api.get as any).mockResolvedValue({
      data: { status: 'DOWN' }
    });

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByText(/Backend Offline/i)).toBeInTheDocument();
    });
  });
});
