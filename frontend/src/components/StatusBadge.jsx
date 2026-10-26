import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const StatusBadge = ({ status, flagCount }) => {
  const isNormal = status === 'Normal';

  return (
    <span className={`status-badge ${isNormal ? 'badge-normal' : 'badge-flagged'}`}>
      {isNormal ? (
        <>
          <CheckCircle2 size={14} className="badge-icon" />
          <span>Normal</span>
        </>
      ) : (
        <>
          <AlertTriangle size={14} className="badge-icon" />
          <span>Flagged {flagCount !== undefined && flagCount > 0 ? `(${flagCount})` : ''}</span>
        </>
      )}
    </span>
  );
};
