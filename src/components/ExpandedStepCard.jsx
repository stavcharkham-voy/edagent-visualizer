import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  List,
  CreditCard,
  HelpCircle,
  Image as ImageIcon,
  MousePointerClick,
  CheckCircle,
  XCircle,
  Info,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import clsx from 'clsx';

const getIcon = (type) => {
  switch (type) {
    case 'landing_page': return <MousePointerClick size={18} />;
    case 'registration': return <CheckCircle size={18} />;
    case 'payment':
    case 'pricing_page': return <CreditCard size={18} />;
    case 'questionnaire': return <HelpCircle size={18} />;
    case 'subscription': return <CheckCircle size={18} />;
    default: return <Info size={18} />;
  }
};

const getColorClass = (type) => {
  switch (type) {
    case 'landing_page': return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
    case 'registration':
    case 'questionnaire': return 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10';
    case 'payment':
    case 'pricing_page': return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
    case 'subscription': return 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10';
    default: return 'border-l-gray-400 bg-gray-50/50 dark:bg-gray-800/50';
  }
};

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!children) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-gray-600 dark:text-gray-400" />}
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
};

const ExpandedStepCard = ({ step, pricingModel, questionnaires, metrics }) => {
  const stepType = step.step_type || 'other';
  const questionnaire = step.questionnaire_ref
    ? questionnaires?.find(q => q.questionnaire_id === step.questionnaire_ref)
    : null;

  return (
    <div className={clsx(
      "border-l-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm",
      getColorClass(stepType)
    )}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-white/50 dark:bg-black/20">
                {getIcon(stepType)}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {stepType.replace('_', ' ')}
              </span>
              {step.status && (
                <span className={clsx(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  step.status === 'verified'
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                )}>
                  {step.status}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {step.step_name}
            </h3>
            {step.url_or_screen && (
              <a
                href={step.url_or_screen}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {step.url_or_screen}
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {step.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {step.description}
          </p>
        )}

        {/* Metrics Section - Only show if metrics are provided */}
        {metrics && (
          <CollapsibleSection
            title="Metrics"
            icon={Activity}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {/* CPA */}
              {metrics.stepCPA && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Cost Per Acquisition (CPA)</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${metrics.stepCPA.cpa}
                  </div>
                </div>
              )}

              {/* Conversion Rates */}
              {(metrics.incomingConversionRate || metrics.outgoingConversionRate) && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Conversion Rates</span>
                  </div>
                  <div className="space-y-2">
                    {metrics.incomingConversionRate && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">From {metrics.previousStepName || 'Previous Step'}:</span>
                        <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">
                          {metrics.incomingConversionRate.rate}%
                        </span>
                      </div>
                    )}
                    {metrics.outgoingConversionRate && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">To {metrics.nextStepName || 'Next Step'}:</span>
                        <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">
                          {metrics.outgoingConversionRate.rate}%
                        </span>
                      </div>
                    )}
                    {!metrics.incomingConversionRate && !metrics.outgoingConversionRate && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">No conversion rates available</div>
                    )}
                  </div>
                </div>
              )}

              {/* Signals Calculation */}
              {metrics.signals !== null && metrics.stepCPA && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Signals</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Total Monthly Spend: <span className="font-mono font-semibold">${metrics.totalMonthlySpend.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      CPA: <span className="font-mono font-semibold">${metrics.stepCPA.cpa}</span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {metrics.signals.toLocaleString()} signals/month
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Calculated: ${metrics.totalMonthlySpend.toLocaleString()} ÷ ${metrics.stepCPA.cpa} = {metrics.signals.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        <div className="space-y-3">
          {/* Inputs */}
          <CollapsibleSection
            title={`Inputs (${step.inputs?.length || 0})`}
            icon={List}
            defaultOpen={true}
          >
            {step.inputs && step.inputs.length > 0 ? (
              <div className="space-y-3">
                {step.inputs.map((input) => (
                  <div key={input.field_id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{input.label}</span>
                        {input.required && (
                          <span className="ml-2 text-xs text-red-600 dark:text-red-400">*</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {input.type}
                      </span>
                    </div>
                    {input.example_value && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 p-2 rounded mt-2">
                        Example: {input.example_value}
                      </div>
                    )}
                    {input.validation_rules && input.validation_rules.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {input.validation_rules.map((rule, idx) => (
                          <span key={idx} className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            {rule}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No inputs required</p>
            )}
          </CollapsibleSection>

          {/* CTAs/Buttons */}
          <CollapsibleSection
            title={`Actions (${step.buttons_or_ctas?.length || 0})`}
            icon={MousePointerClick}
            defaultOpen={true}
          >
            {step.buttons_or_ctas && step.buttons_or_ctas.length > 0 ? (
              <div className="space-y-2">
                {step.buttons_or_ctas.map((cta) => (
                  <div key={cta.cta_id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{cta.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {cta.action}
                      </span>
                    </div>
                    {cta.url && (
                      <a
                        href={cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                      >
                        {cta.url}
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {cta.conditions && cta.conditions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {cta.conditions.map((condition, idx) => (
                          <span key={idx} className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No actions available</p>
            )}
          </CollapsibleSection>

          {/* Questions */}
          {questionnaire && (
            <CollapsibleSection
              title={`Questions (${questionnaire.questions?.length || 0})`}
              icon={HelpCircle}
              defaultOpen={true}
            >
              <div className="space-y-3">
                {questionnaire.questions.map((q) => (
                  <div key={q.question_id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{q.text}</div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded ml-2">
                        {q.type}
                      </span>
                    </div>
                    {q.options && q.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {q.options.map((opt) => (
                          <span
                            key={opt.option_id}
                            className={clsx(
                              "text-xs px-2 py-1 rounded border",
                              opt.is_default
                                ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                            )}
                          >
                            {opt.text}
                            {opt.is_default && " (default)"}
                          </span>
                        ))}
                      </div>
                    )}
                    {q.validation?.required && (
                      <span className="text-xs text-red-600 dark:text-red-400 mt-2 block">Required</span>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Pricing */}
          {(step.step_type === 'pricing_page' || step.step_type === 'payment') && pricingModel && (
            <CollapsibleSection
              title="Pricing Plans"
              icon={CreditCard}
              defaultOpen={true}
            >
              <div className="space-y-3">
                {pricingModel.plans.map((plan) => (
                  <div key={plan.plan_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="font-bold text-sm text-gray-900 dark:text-white mb-1">{plan.plan_name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">{plan.description}</div>
                    {plan.payment_intervals && plan.payment_intervals.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {plan.payment_intervals.map((interval, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${interval.price}/{interval.interval_type}
                              </span>
                              {interval.discounts?.trial_period_days && (
                                <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                                  {interval.discounts.trial_period_days} day trial
                                </span>
                              )}
                            </div>
                            {interval.discounts?.renewal_rules && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {interval.discounts.renewal_rules} renewal
                              </span>
                            )}
                          </div>
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
            </CollapsibleSection>
          )}


          {/* Media */}
          {step.media_refs && step.media_refs.screenshots && step.media_refs.screenshots.length > 0 && (
            <CollapsibleSection
              title={`Screenshots (${step.media_refs.screenshots.length})`}
              icon={ImageIcon}
              defaultOpen={false}
            >
              <div className="space-y-2">
                {step.media_refs.screenshots.map((src, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">{src}</div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Notes */}
          {step.notes && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">Notes:</div>
              <div className="text-sm text-amber-700 dark:text-amber-400">{step.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedStepCard;

