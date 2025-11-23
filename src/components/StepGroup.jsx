import React from 'react';
import { ChevronRight } from 'lucide-react';

const StepGroup = ({ group, children }) => {
  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {group.title}
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ({group.steps.length} {group.steps.length === 1 ? 'step' : 'steps'})
        </span>
      </div>

      {/* Grouped Steps */}
      <div className="space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
};

export default StepGroup;

