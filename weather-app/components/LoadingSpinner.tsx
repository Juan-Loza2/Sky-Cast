import React from "react";
import { Radar as RadarIcon } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(51, 65, 85, 0.9)' }}>
      <RadarIcon className="spinner-radar" size={36} />
      <style jsx>{`
        .spinner-radar {
          color: #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 