import React from "react";

type Action = 'generate' | 'verify';

export function ActionSelector({ currentAction, onSelect }: { currentAction: Action; onSelect: (a: Action) => void }) {
  return (
    <div className="action-selector">
      <div className={`action-option${currentAction === 'generate' ? ' selected' : ''}`} onClick={() => onSelect('generate')}>
        <div className="action-title">GENERATE</div>
        <div className="action-desc">Create new proof</div>
      </div>
      <div className={`action-option${currentAction === 'verify' ? ' selected' : ''}`} onClick={() => onSelect('verify')}>
        <div className="action-title">VERIFY</div>
        <div className="action-desc">Validate existing proof</div>
      </div>
    </div>
  );
} 