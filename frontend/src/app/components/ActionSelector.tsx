interface ActionSelectorProps {
  currentAction: 'generate' | 'verify';
  onActionChange: (action: 'generate' | 'verify') => void;
}

export const ActionSelector = ({ currentAction, onActionChange }: ActionSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      <div 
        className={`bg-gray-900 border border-gray-700 rounded p-5 cursor-pointer transition-all duration-200 text-center ${
          currentAction === 'generate' ? 'bg-white text-black border-white' : 'hover:border-white'
        }`}
        onClick={() => onActionChange('generate')}
      >
        <div className="text-sm font-medium mb-2">GENERATE</div>
        <div className={`text-xs ${currentAction === 'generate' ? 'text-gray-600' : 'text-gray-500'}`}>
          Create new proof
        </div>
      </div>
      
      <div 
        className={`bg-gray-900 border border-gray-700 rounded p-5 cursor-pointer transition-all duration-200 text-center ${
          currentAction === 'verify' ? 'bg-white text-black border-white' : 'hover:border-white'
        }`}
        onClick={() => onActionChange('verify')}
      >
        <div className="text-sm font-medium mb-2">VERIFY</div>
        <div className={`text-xs ${currentAction === 'verify' ? 'text-gray-600' : 'text-gray-500'}`}>
          Validate existing proof
        </div>
      </div>
    </div>
  );
}; 