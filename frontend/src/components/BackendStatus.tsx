import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'up' | 'down'>('loading');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const start = Date.now();
      try {
        const response = await api.get('/v1/health');
        if (response.data.status === 'UP') {
          setStatus('up');
          setLatency(Date.now() - start);
        } else {
          setStatus('down');
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setStatus('down');
      }
    };

    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-xs px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
        <Loader2 size={12} className="animate-spin" />
        <span>Checking backend...</span>
      </div>
    );
  }

  if (status === 'up') {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-xs px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
        <CheckCircle2 size={12} />
        <span>Backend Online {latency !== null && `(${latency}ms)`}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-rose-400 text-xs px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
      <XCircle size={12} />
      <span>Backend Offline</span>
    </div>
  );
};

export default BackendStatus;
