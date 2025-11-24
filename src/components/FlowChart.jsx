import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getOrderedSteps } from '../utils/getOrderedSteps';
import clsx from 'clsx';

const getColorClass = (type) => {
  switch (type) {
    case 'landing_page': return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    case 'registration':
    case 'questionnaire': return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
    case 'payment':
    case 'pricing_page': return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
    case 'subscription': return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
  }
};

const FlowChart = ({ steps, onStepClick }) => {
  const orderedSteps = getOrderedSteps(steps);

  if (orderedSteps.length === 0) return null;

  const handleStepClick = (step) => {
    if (onStepClick) {
      onStepClick(step.step_id);
    }
  };

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 flex-wrap">
        {orderedSteps.map((step, index) => (
          <React.Fragment key={step.step_id}>
            <button
              onClick={() => handleStepClick(step)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                "hover:scale-105 hover:shadow-md cursor-pointer",
                "whitespace-nowrap",
                getColorClass(step.step_type || 'other')
              )}
              title={step.step_name}
            >
              {step.step_name}
            </button>
            {index < orderedSteps.length - 1 && (
              <ArrowRight 
                size={16} 
                className="text-gray-400 dark:text-gray-500 flex-shrink-0 mx-1" 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FlowChart;

