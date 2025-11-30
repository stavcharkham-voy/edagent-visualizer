import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

const PricingModelSection = ({ pricingModelClassification, pricingModelData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
          <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Pricing Model
          </h2>
          {!isOpen && pricingModelClassification && (
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              : {pricingModelClassification}
            </span>
          )}
          {pricingModelData?.plans && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({pricingModelData.plans.length} plans)
            </span>
          )}
        </div>
      </button>

      {/* Collapsed Preview */}
      {!isOpen && pricingModelClassification && (
        <div className="px-6 pb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pricingModelClassification}
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-6 pt-0 space-y-6">
          {/* Classification */}
          {pricingModelClassification && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Classification:
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pricingModelClassification}
              </div>
            </div>
          )}

          {/* Pricing Plans */}
          {pricingModelData && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pricing Plans</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({pricingModelData.plans?.length || 0} plans)
                </span>
              </div>
              {pricingModelData.currency && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Currency: <span className="font-mono">{pricingModelData.currency}</span>
                </div>
              )}
              <div className="grid gap-3">
                {pricingModelData.plans?.map((plan) => (
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
                    {plan.features && plan.features.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
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
  );
};

export default PricingModelSection;

