import React from "react";

type Action = 'generate' | 'verify';

export function ActionSelector({ currentAction, onSelect }: { currentAction: Action; onSelect: (a: Action) => void }) {
  return (
    <div className="action-selector grid grid-cols-2 gap-4 mb-5">
      <div
        className={`action-option rounded-md border border-neutral-800 p-5 cursor-pointer transition-all text-center ${currentAction === 'generate' ? 'selected bg-white text-black border-white' : 'bg-neutral-900 text-neutral-300 hover:border-white'}`}
        onClick={() => onSelect('generate')}
      >
        <div className="action-title text-sm font-medium mb-2">GENERATE</div>
        <div className={`action-desc text-xs ${currentAction === 'generate' ? 'text-neutral-500' : 'text-neutral-400'}`}>Create new proof</div>
      </div>
      <div
        className={`action-option rounded-md border border-neutral-800 p-5 cursor-pointer transition-all text-center ${currentAction === 'verify' ? 'selected bg-white text-black border-white' : 'bg-neutral-900 text-neutral-300 hover:border-white'}`}
        onClick={() => onSelect('verify')}
      >
        <div className="action-title text-sm font-medium mb-2">VERIFY</div>
        <div className={`action-desc text-xs ${currentAction === 'verify' ? 'text-neutral-500' : 'text-neutral-400'}`}>Validate existing proof</div>
      </div>
    </div>
  );
} 