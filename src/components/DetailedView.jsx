import React from 'react';
import { ExternalLink, Globe, TrendingUp } from 'lucide-react';
import { groupSteps } from '../utils/groupSteps';
import StepGroup from './StepGroup';
import ExpandedStepCard from './ExpandedStepCard';

const DetailedView = ({ flowData, pricingModel, questionnaires }) => {
  const groupedSteps = groupSteps(flowData.steps || []);

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

        {/* Entry Points */}
        {flowData.entry_points && flowData.entry_points.length > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Entry Points</h2>
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

        {/* Pricing Model Overview (if exists) */}
        {pricingModel && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pricing Model</h2>
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

        {/* Grouped Steps */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Flow Steps</h2>
          {groupedSteps.length > 0 ? (
            <div className="space-y-6">
              {groupedSteps.map((group, groupIdx) => (
                <StepGroup key={groupIdx} group={group}>
                  {group.steps.map((step) => (
                    <ExpandedStepCard
                      key={step.step_id}
                      step={step}
                      pricingModel={pricingModel}
                      questionnaires={questionnaires}
                    />
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

