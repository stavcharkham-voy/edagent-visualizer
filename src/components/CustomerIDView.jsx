import React, { useState, useMemo } from 'react';
import { customerIDData } from '../data/customerIDData';
import PricingModelSection from './PricingModelSection';
import FunnelSection from './FunnelSection';
import SpendSection from './SpendSection';
import FeatureImportanceSection from './FeatureImportanceSection';
import miroLogoUrl from '../assets/miro-logo.svg?url';

const CustomerIDView = ({ flowData, pricingModel, questionnaires }) => {
  const [conversionRates, setConversionRates] = useState(customerIDData.conversionRates);
  const [stepCPAs, setStepCPAs] = useState(customerIDData.stepCPAs || []);
  const [adSpend, setAdSpend] = useState(customerIDData.adSpend);

  // Calculate last updated time (5 minutes ago)
  const lastUpdated = useMemo(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Extract company name from funnel_name or use default
  const companyName = useMemo(() => {
    if (flowData?.funnel_name) {
      // Try to extract company name (e.g., "Miro Web User Signup..." -> "Miro")
      const match = flowData.funnel_name.match(/^(\w+)/);
      return match ? match[1] : 'Miro';
    }
    return 'Miro';
  }, [flowData]);

  const handleConversionRateUpdate = (fromStepId, toStepId, field, value) => {
    if (field === 'delete') {
      setConversionRates(prev => 
        prev.filter(cr => !(cr.fromStepId === fromStepId && cr.toStepId === toStepId))
      );
    } else {
      setConversionRates(prev => 
        prev.map(cr => 
          cr.fromStepId === fromStepId && cr.toStepId === toStepId
            ? { ...cr, [field]: value }
            : cr
        )
      );
    }
  };

  const handleAddConversionRate = (newConversionRate) => {
    setConversionRates(prev => [...prev, newConversionRate]);
  };

  const handleStepCPAUpdate = (stepId, field, value) => {
    if (field === 'delete' || value === null) {
      setStepCPAs(prev => prev.filter(cpa => cpa.stepId !== stepId));
    } else {
      setStepCPAs(prev => {
        const existing = prev.find(cpa => cpa.stepId === stepId);
        if (existing) {
          return prev.map(cpa => 
            cpa.stepId === stepId ? { ...cpa, [field]: value } : cpa
          );
        } else {
          return [...prev, { stepId, stepName: '', [field]: value }];
        }
      });
    }
  };

  const handleAddStepCPA = (newCPA) => {
    setStepCPAs(prev => {
      const existing = prev.find(cpa => cpa.stepId === newCPA.stepId);
      if (existing) {
        return prev.map(cpa => 
          cpa.stepId === newCPA.stepId ? newCPA : cpa
        );
      }
      return [...prev, newCPA];
    });
  };

  const handleAdSpendUpdate = (channelId, newAmount) => {
    setAdSpend(prev => ({
      monthly: prev.monthly.map(item =>
        item.id === channelId ? { ...item, amount: newAmount } : item
      )
    }));
  };

  const handleAddChannel = (newChannel) => {
    const newId = `channel-${Date.now()}`;
    setAdSpend(prev => ({
      monthly: [...prev.monthly, { ...newChannel, id: newId }]
    }));
  };

  const handleRemoveChannel = (channelId) => {
    setAdSpend(prev => ({
      monthly: prev.monthly.filter(item => item.id !== channelId)
    }));
  };

  // Calculate total monthly spend
  const totalMonthlySpend = useMemo(() => {
    return adSpend?.monthly?.reduce((sum, item) => sum + item.amount, 0) || 0;
  }, [adSpend]);

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="h-8 flex items-center">
                <img src={miroLogoUrl} alt="Miro Logo" className="h-full w-auto" />
              </div>
              
              {/* Company Name */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {companyName} ID
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customer Intelligence Dashboard
                </p>
              </div>
            </div>
            
            {/* Last Updated */}
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last updated</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {lastUpdated}
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <PricingModelSection 
          pricingModelClassification={customerIDData.pricingModel}
          pricingModelData={pricingModel}
        />
        
        <FunnelSection
          steps={flowData?.steps || []}
          conversionRates={conversionRates}
          stepCPAs={stepCPAs}
          totalMonthlySpend={totalMonthlySpend}
          onConversionRateUpdate={handleConversionRateUpdate}
          onStepCPAUpdate={handleStepCPAUpdate}
          onAddConversionRate={handleAddConversionRate}
          onAddStepCPA={handleAddStepCPA}
          pricingModel={pricingModel}
          questionnaires={questionnaires}
        />
        
        <SpendSection
          adSpend={adSpend}
          onAdSpendUpdate={handleAdSpendUpdate}
          onAddChannel={handleAddChannel}
          onRemoveChannel={handleRemoveChannel}
        />
        
        <FeatureImportanceSection
          featureImportance={customerIDData.featureImportance}
        />
      </div>
    </div>
  );
};

export default CustomerIDView;

