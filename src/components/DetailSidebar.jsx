import React from 'react';
import { X, ExternalLink, CreditCard, List, Image as ImageIcon, Activity } from 'lucide-react';

const DetailSidebar = ({ step, onClose, pricingModel }) => {
    if (!step) return null;

    return (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-start z-10">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {step.step_type.replace('_', ' ')}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                        {step.step_name}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* Description */}
                <section>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                    </p>
                    {step.url_or_screen && (
                        <a
                            href={step.url_or_screen}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Visit Page <ExternalLink size={14} />
                        </a>
                    )}
                </section>

                {/* Inputs */}
                {step.inputs && step.inputs.length > 0 && (
                    <section>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                            <List size={18} /> Inputs
                        </h3>
                        <div className="space-y-3">
                            {step.inputs.map((input) => (
                                <div key={input.field_id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-sm">{input.label}</span>
                                        <span className="text-xs text-gray-500 uppercase">{input.type}</span>
                                    </div>
                                    {input.validation_rules && (
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
                    </section>
                )}

                {/* Pricing (Special handling if it's a pricing page or has pricing model) */}
                {(step.step_type === 'pricing_page' || step.step_type === 'payment') && pricingModel && (
                    <section>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                            <CreditCard size={18} /> Pricing Plans
                        </h3>
                        <div className="space-y-3">
                            {pricingModel.plans.map((plan) => (
                                <div key={plan.plan_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    <div className="font-bold text-sm">{plan.plan_name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{plan.description}</div>
                                    <div className="mt-2 flex gap-2">
                                        {plan.payment_intervals.map((interval, idx) => (
                                            <span key={idx} className="text-xs font-mono bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                                ${interval.price}/{interval.interval_type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Screenshots */}
                {step.media_refs && step.media_refs.screenshots && step.media_refs.screenshots.length > 0 && (
                    <section>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                            <ImageIcon size={18} /> Screenshots
                        </h3>
                        <div className="grid gap-3">
                            {step.media_refs.screenshots.map((src, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    {/* Placeholder for S3 images since we can't actually load them without auth usually, but we'll try to render an img tag */}
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                                        {/* In a real app we'd handle s3:// links. For now, just showing the path */}
                                        <span className="p-4 text-center break-all">{src}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tracking */}
                {step.tracking_data && (
                    <section>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                            <Activity size={18} /> Tracking
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Event Name:</span>
                                <span className="font-mono">{step.tracking_data.event_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Trigger:</span>
                                <span className="font-mono">{step.tracking_data.event_trigger}</span>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default DetailSidebar;
