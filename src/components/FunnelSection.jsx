import React, { useState } from 'react';
import { ChevronDown, ChevronUp, GitBranch, ArrowRight, DollarSign, Plus, X } from 'lucide-react';
import { getOrderedSteps } from '../utils/getOrderedSteps';
import DetailModal from './DetailModal';
import ExpandedStepCard from './ExpandedStepCard';
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

const EditableMetric = ({ value, onSave, label, prefix = '', suffix = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value && editValue !== '') {
      onSave(editValue);
    } else {
      setEditValue(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-16 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-colors font-semibold"
      title="Click to edit"
    >
      {prefix}{value}{suffix}
    </span>
  );
};

const FunnelSection = ({ steps, conversionRates, stepCPAs, totalMonthlySpend, onConversionRateUpdate, onStepCPAUpdate, onAddConversionRate, onAddStepCPA, pricingModel, questionnaires }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepMetrics, setStepMetrics] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingConversion, setIsAddingConversion] = useState(false);
  const [isAddingCPA, setIsAddingCPA] = useState(null); // step_id when adding CPA
  const [newConversionRate, setNewConversionRate] = useState({ fromStepId: '', toStepId: '', rate: '' });
  const [newCPA, setNewCPA] = useState({ stepId: '', cpa: '' });

  const orderedSteps = getOrderedSteps(steps || []);
  
  // Create maps for quick lookup
  const conversionRateMap = new Map();
  conversionRates?.forEach(cr => {
    const key = `${cr.fromStepId}-${cr.toStepId}`;
    conversionRateMap.set(key, cr);
  });

  const stepCPAMap = new Map();
  stepCPAs?.forEach(cpa => {
    stepCPAMap.set(cpa.stepId, cpa);
  });

  const handleStepClick = (step) => {
    setSelectedStep(step);
    
    // Find step index in ordered steps
    const stepIndex = orderedSteps.findIndex(s => s.step_id === step.step_id);
    const previousStep = stepIndex > 0 ? orderedSteps[stepIndex - 1] : null;
    const nextStep = stepIndex < orderedSteps.length - 1 ? orderedSteps[stepIndex + 1] : null;
    
    // Find incoming conversion rate (from previous step)
    const incomingConversionRate = previousStep 
      ? conversionRateMap.get(`${previousStep.step_id}-${step.step_id}`)
      : null;
    
    // Find outgoing conversion rate (to next step)
    const outgoingConversionRate = nextStep
      ? conversionRateMap.get(`${step.step_id}-${nextStep.step_id}`)
      : null;
    
    // Get step CPA
    const stepCPA = stepCPAMap.get(step.step_id);
    
    // Calculate signals
    const signals = stepCPA && stepCPA.cpa > 0 
      ? Math.round(totalMonthlySpend / stepCPA.cpa)
      : null;
    
    setStepMetrics({
      stepCPA,
      incomingConversionRate,
      outgoingConversionRate,
      totalMonthlySpend,
      signals,
      previousStepName: previousStep?.step_name,
      nextStepName: nextStep?.step_name
    });
    
    setIsModalOpen(true);
  };

  const handleConversionRateUpdate = (fromStepId, toStepId, field, value) => {
    if (onConversionRateUpdate) {
      onConversionRateUpdate(fromStepId, toStepId, field, value);
    }
  };

  const handleAddConversionRate = () => {
    if (newConversionRate.fromStepId && newConversionRate.toStepId && newConversionRate.rate) {
      const fromStep = orderedSteps.find(s => s.step_id === newConversionRate.fromStepId);
      const toStep = orderedSteps.find(s => s.step_id === newConversionRate.toStepId);
      
      if (onAddConversionRate) {
        onAddConversionRate({
          fromStepId: newConversionRate.fromStepId,
          toStepId: newConversionRate.toStepId,
          fromStepName: fromStep?.step_name || '',
          toStepName: toStep?.step_name || '',
          rate: parseFloat(newConversionRate.rate)
        });
      }
      setNewConversionRate({ fromStepId: '', toStepId: '', rate: '' });
      setIsAddingConversion(false);
    }
  };

  const handleAddStepCPA = () => {
    if (newCPA.stepId && newCPA.cpa) {
      const step = orderedSteps.find(s => s.step_id === newCPA.stepId);
      
      if (onAddStepCPA) {
        onAddStepCPA({
          stepId: newCPA.stepId,
          stepName: step?.step_name || '',
          cpa: parseFloat(newCPA.cpa)
        });
      }
      setNewCPA({ stepId: '', cpa: '' });
      setIsAddingCPA(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronUp size={20} className="text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-400 dark:text-gray-500" />
            )}
            <GitBranch size={18} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Funnel
            </h2>
          </div>
        </button>

        {/* Collapsed Preview - Simple Integrated Design */}
        {!isOpen && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {orderedSteps.map((step, index) => {
                const nextStep = index < orderedSteps.length - 1 ? orderedSteps[index + 1] : null;
                const conversionKey = nextStep ? `${step.step_id}-${nextStep.step_id}` : null;
                const conversionRate = conversionKey ? conversionRateMap.get(conversionKey) : null;
                const stepCPA = stepCPAMap.get(step.step_id);

                return (
                  <React.Fragment key={step.step_id}>
                    {/* Step with CPA Badge Inside - Clickable */}
                    <button
                      onClick={() => handleStepClick(step)}
                      className="relative inline-block cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <span className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border inline-block relative",
                        stepCPA ? "pr-20" : "",
                        getColorClass(step.step_type || 'other')
                      )}>
                        {step.step_name}
                        {/* CPA Badge - Small tag inside box on the right */}
                        {stepCPA && (
                          <span 
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 border border-gray-400 dark:border-gray-500 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 whitespace-nowrap"
                            title={`CPA: $${stepCPA.cpa}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            ${stepCPA.cpa} CPA
                          </span>
                        )}
                      </span>
                    </button>

                    {/* Real Arrow Line with Conversion Rate */}
                    {nextStep && (
                      <div className="relative flex items-center justify-center min-w-[60px] h-6">
                        {/* Arrow line using SVG */}
                        <svg 
                          className="absolute inset-0 w-full h-full" 
                          style={{ overflow: 'visible' }}
                        >
                          <defs>
                            <marker
                              id={`arrowhead-${step.step_id}`}
                              markerWidth="10"
                              markerHeight="10"
                              refX="9"
                              refY="3"
                              orient="auto"
                            >
                              <polygon
                                points="0 0, 10 3, 0 6"
                                fill={conversionRate ? "#9333ea" : "#9ca3af"}
                                className={conversionRate ? "dark:fill-purple-400" : "dark:fill-gray-500"}
                              />
                            </marker>
                          </defs>
                          <line
                            x1="0"
                            y1="50%"
                            x2="100%"
                            y2="50%"
                            stroke={conversionRate ? "#9333ea" : "#9ca3af"}
                            strokeWidth="2"
                            markerEnd={`url(#arrowhead-${step.step_id})`}
                            className={conversionRate ? "dark:stroke-purple-400" : "dark:stroke-gray-500"}
                          />
                        </svg>
                        {/* Conversion Rate - On the arrow line */}
                        {conversionRate && (
                          <span className="relative z-10 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 text-xs font-bold px-1">
                            {conversionRate.rate}%
                          </span>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isOpen && (
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {orderedSteps.map((step, index) => {
                const nextStep = index < orderedSteps.length - 1 ? orderedSteps[index + 1] : null;
                const conversionKey = nextStep ? `${step.step_id}-${nextStep.step_id}` : null;
                const conversionRate = conversionKey ? conversionRateMap.get(conversionKey) : null;
                const stepCPA = stepCPAMap.get(step.step_id);

                return (
                  <React.Fragment key={step.step_id}>
                    <div className="flex items-center gap-3">
                      {/* Step Button with CPA */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStepClick(step)}
                          className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                            "hover:scale-105 hover:shadow-md cursor-pointer",
                            "whitespace-nowrap min-w-[200px] text-left",
                            getColorClass(step.step_type || 'other')
                          )}
                          title={step.step_name}
                        >
                          {step.step_name}
                        </button>
                        
                        {/* Step CPA */}
                        {stepCPA ? (
                          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800">
                            <DollarSign size={12} className="text-green-600 dark:text-green-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">CPA:</span>
                            <EditableMetric
                              value={stepCPA.cpa}
                              onSave={(value) => onStepCPAUpdate(step.step_id, 'cpa', parseFloat(value))}
                              prefix="$"
                            />
                            <button
                              onClick={() => onStepCPAUpdate(step.step_id, 'cpa', null)}
                              className="ml-1 p-0.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                              title="Remove CPA"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsAddingCPA(step.step_id)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Add CPA"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>

                      {/* Arrow and Conversion Rate */}
                      {nextStep && (
                        <div className="flex items-center gap-2 flex-1">
                          <ArrowRight 
                            size={20} 
                            className={clsx(
                              "flex-shrink-0",
                              conversionRate ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"
                            )} 
                          />
                          
                          {conversionRate ? (
                            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">CTR:</span>
                                <EditableMetric
                                  value={conversionRate.rate}
                                  onSave={(value) => handleConversionRateUpdate(
                                    conversionRate.fromStepId,
                                    conversionRate.toStepId,
                                    'rate',
                                    parseFloat(value)
                                  )}
                                  suffix="%"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  handleConversionRateUpdate(conversionRate.fromStepId, conversionRate.toStepId, 'delete', null);
                                }}
                                className="ml-1 p-0.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                                title="Remove conversion rate"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setNewConversionRate({ 
                                  fromStepId: step.step_id, 
                                  toStepId: nextStep.step_id, 
                                  rate: '' 
                                });
                                setIsAddingConversion(true);
                              }}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              title="Add conversion rate"
                            >
                              <Plus size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Add Conversion Rate Form */}
                    {isAddingConversion && newConversionRate.fromStepId === step.step_id && newConversionRate.toStepId === nextStep?.step_id && (
                      <div className="ml-8 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Conversion rate %"
                          value={newConversionRate.rate}
                          onChange={(e) => setNewConversionRate({ ...newConversionRate, rate: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={handleAddConversionRate}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingConversion(false);
                            setNewConversionRate({ fromStepId: '', toStepId: '', rate: '' });
                          }}
                          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Add CPA Form */}
                    {isAddingCPA === step.step_id && (
                      <div className="ml-8 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="CPA amount"
                          value={newCPA.cpa}
                          onChange={(e) => setNewCPA({ stepId: step.step_id, cpa: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={handleAddStepCPA}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingCPA(null);
                            setNewCPA({ stepId: '', cpa: '' });
                          }}
                          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStep?.step_name || 'Step Details'}
        type="drawer"
      >
        {selectedStep && (
          <ExpandedStepCard
            step={selectedStep}
            pricingModel={pricingModel}
            questionnaires={questionnaires}
            metrics={stepMetrics}
          />
        )}
      </DetailModal>
    </>
  );
};

export default FunnelSection;
