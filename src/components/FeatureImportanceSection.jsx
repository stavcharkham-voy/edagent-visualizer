import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DetailModal from './DetailModal';

const getColorForFeatureValue = (featureValue) => {
  // Map feature value (0-1) to color gradient: blue (low) -> red (high)
  const r = Math.round(255 * featureValue);
  const b = Math.round(255 * (1 - featureValue));
  return `rgb(${r}, 0, ${b})`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          SHAP Value: <span className="font-mono">{data.shapValue.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Feature Value: <span className="font-mono">{data.featureValue.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Impact: <span className={data.impact === 'positive' ? 'text-green-600' : 'text-red-600'}>
            {data.impact}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const FeatureImportanceSection = ({ featureImportance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chartData = useMemo(() => {
    if (!featureImportance || featureImportance.length === 0) return [];
    
    return featureImportance
      .map(feature => ({
        name: feature.name.length > 50 ? feature.name.substring(0, 50) + '...' : feature.name,
        fullName: feature.name,
        shapValue: feature.shapValue,
        featureValue: feature.featureValue,
        impact: feature.impact,
        color: getColorForFeatureValue(feature.featureValue)
      }))
      .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)); // Sort by absolute SHAP value
  }, [featureImportance]);

  const topFeatures = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return chartData.slice(0, 5); // Top 5 features
  }, [chartData]);

  const minShap = useMemo(() => {
    if (chartData.length === 0) return -5;
    return Math.min(...chartData.map(d => d.shapValue)) - 1;
  }, [chartData]);

  const maxShap = useMemo(() => {
    if (chartData.length === 0) return 5;
    return Math.max(...chartData.map(d => d.shapValue)) + 1;
  }, [chartData]);

  const handleBarClick = (data) => {
    if (data && data.payload) {
      setSelectedFeature(data.payload);
      setIsModalOpen(true);
    }
  };

  if (!featureImportance || featureImportance.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
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
            <BarChart3 size={18} className="text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Feature Importance
            </h2>
          </div>
        </button>
        {!isOpen && (
          <div className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400">
            No feature importance data available
          </div>
        )}
        {isOpen && (
          <div className="p-6 pt-0 text-center text-gray-500 dark:text-gray-400">
            No feature importance data available
          </div>
        )}
      </div>
    );
  }

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
            <BarChart3 size={18} className="text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Feature Importance
            </h2>
          </div>
        </button>

        {/* Collapsed Preview - Top Features */}
        {!isOpen && topFeatures.length > 0 && (
          <div className="px-6 pb-6 space-y-2">
            {topFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                  {feature.fullName.length > 40 ? feature.fullName.substring(0, 40) + '...' : feature.fullName}
                </span>
                <span className={`ml-2 font-semibold ${
                  feature.shapValue > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {feature.shapValue > 0 ? '+' : ''}{feature.shapValue.toFixed(2)}
                </span>
              </div>
            ))}
            {featureImportance.length > 5 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                + {featureImportance.length - 5} more features
              </div>
            )}
          </div>
        )}

        {/* Expanded Content */}
        {isOpen && (
          <div className="p-6 pt-0">
            {/* Legend */}
            <div className="mb-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Low Feature Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">High Feature Value</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[600px] overflow-y-auto">
              <ResponsiveContainer width="100%" height={chartData.length * 40}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
                >
                  <XAxis
                    type="number"
                    domain={[minShap, maxShap]}
                    label={{ value: 'SHAP value (impact on model output)', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={180}
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="shapValue"
                    fill="#8884d8"
                    onClick={handleBarClick}
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFeature?.fullName || 'Feature Details'}
        type="drawer"
      >
        {selectedFeature && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Feature Name</div>
              <div className="text-base text-gray-900 dark:text-white font-mono break-all">
                {selectedFeature.fullName}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">SHAP Value</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedFeature.shapValue.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedFeature.shapValue > 0 ? 'Positive impact on model output' : 'Negative impact on model output'}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Feature Value</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedFeature.featureValue.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Normalized feature value (0 = low, 1 = high)
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Impact</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                selectedFeature.impact === 'positive'
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
                {selectedFeature.impact}
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </>
  );
};

export default FeatureImportanceSection;

