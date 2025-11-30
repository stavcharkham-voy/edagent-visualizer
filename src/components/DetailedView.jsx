import React, { useRef, useState } from 'react';
import { ExternalLink, Globe, TrendingUp, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { groupSteps } from '../utils/groupSteps';
import StepGroup from './StepGroup';
import ExpandedStepCard from './ExpandedStepCard';
import FlowChart from './FlowChart';

const DetailedView = ({ flowData, pricingModel, questionnaires }) => {
  const groupedSteps = groupSteps(flowData.steps || []);
  const stepRefs = useRef({});
  const [isMetaOpen, setIsMetaOpen] = useState(true);

  const handleStepClick = (stepId) => {
    const element = stepRefs.current[stepId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a subtle highlight effect
      element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Funnel Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {flowData.funnel_name || 'Untitled Flow'}
          </h1>
          {flowData.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{flowData.notes}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Platform: {flowData.platform || 'N/A'}</span>
            <span>•</span>
            <span>Created: {flowData.created_at ? new Date(flowData.created_at).toLocaleDateString() : 'N/A'}</span>
            <span>•</span>
            <span>{flowData.steps?.length || 0} Steps</span>
          </div>
        </div>

        {/* Meta Section - Collapsible */}
        {(flowData.entry_points?.length > 0 || pricingModel) && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Meta Header - Clickable */}
            <button
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                {isMetaOpen ? (
                  <ChevronUp size={20} className="text-gray-400 dark:text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400 dark:text-gray-500" />
                )}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Meta</h2>
                <Info size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
            </button>

            {/* Meta Content */}
            {isMetaOpen && (
              <div className="p-6 pt-0 space-y-6">
                {/* Entry Points */}
                {flowData.entry_points && flowData.entry_points.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Globe size={18} className="text-blue-600 dark:text-blue-400" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Entry Points</h3>
                    </div>
                    <div className="space-y-3">
                      {flowData.entry_points.map((entry, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                {entry.source}
                              </span>
                              {entry.metadata?.campaign_id && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  Campaign: {entry.metadata.campaign_id}
                                </span>
                              )}
                            </div>
                          </div>
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {entry.url}
                            <ExternalLink size={14} />
                          </a>
                          {entry.metadata && (entry.metadata.utm_source || entry.metadata.utm_medium || entry.metadata.utm_campaign) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {entry.metadata.utm_source && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                  Source: {entry.metadata.utm_source}
                                </span>
                              )}
                              {entry.metadata.utm_medium && (
                                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                  Medium: {entry.metadata.utm_medium}
                                </span>
                              )}
                              {entry.metadata.utm_campaign && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                                  Campaign: {entry.metadata.utm_campaign}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flow Steps */}
                {flowData.steps && flowData.steps.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Flow Steps</h3>
                    <FlowChart 
                      steps={flowData.steps || []} 
                      onStepClick={handleStepClick}
                    />
                  </div>
                )}

                {/* Pricing Model */}
                {pricingModel && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pricing Model</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({pricingModel.plans?.length || 0} plans)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Currency: <span className="font-mono">{pricingModel.currency || 'N/A'}</span>
                    </div>
                    <div className="grid gap-3">
                      {pricingModel.plans?.map((plan) => (
                        <div key={plan.plan_id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="font-bold text-sm text-gray-900 dark:text-white mb-1">{plan.plan_name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{plan.description}</div>
                          {plan.payment_intervals && plan.payment_intervals.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {plan.payment_intervals.map((interval, idx) => (
                                <span key={idx} className="text-xs font-mono bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                  ${interval.price}/{interval.interval_type}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Grouped Steps */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Flow Steps</h2>

          {groupedSteps.length > 0 ? (
            <div className="space-y-6">
              {groupedSteps.map((group, groupIdx) => (
                <StepGroup key={groupIdx} group={group}>
                  {group.steps.map((step) => (
                    <div
                      key={step.step_id}
                      ref={(el) => {
                        if (el) stepRefs.current[step.step_id] = el;
                      }}
                      className="transition-all duration-300"
                    >
                      <ExpandedStepCard
                        step={step}
                        pricingModel={pricingModel}
                        questionnaires={questionnaires}
                      />
                    </div>
                  ))}
                </StepGroup>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No steps found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedView;

