import React from "react";

type Action = 'generate' | 'verify';

export function ActionSelector({ currentAction, onSelect }: { currentAction: Action; onSelect: (a: Action) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <button
        className={`rounded-lg py-4 px-2 font-semibold text-sm transition-all border border-gray-700 flex flex-col items-center ${currentAction === 'generate' ? 'bg-white text-black border-white shadow' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
        onClick={() => onSelect('generate')}
        type="button"
      >
        <span>GENERATE</span>
        <span className="text-xs text-gray-500 mt-1">Create new proof</span>
      </button>
      <button
        className={`rounded-lg py-4 px-2 font-semibold text-sm transition-all border border-gray-700 flex flex-col items-center ${currentAction === 'verify' ? 'bg-white text-black border-white shadow' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
        onClick={() => onSelect('verify')}
        type="button"
      >
        <span>VERIFY</span>
        <span className="text-xs text-gray-500 mt-1">Validate existing proof</span>
      </button>
    </div>
  );
} 