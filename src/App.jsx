import React, { useState } from 'react';
import InputScreen from './components/InputScreen';
import FlowCanvas from './components/FlowCanvas';
import DetailSidebar from './components/DetailSidebar';
import DetailedView from './components/DetailedView';
import { LayoutGrid, ChevronLeft, GitBranch, List } from 'lucide-react';

function App() {
  const [flowData, setFlowData] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [viewMode, setViewMode] = useState('flow'); // 'flow' or 'detailed'

  const handleDataLoaded = (data) => {
    setFlowData(data);
  };

  const handleReset = () => {
    setFlowData(null);
    setSelectedStep(null);
  };

  if (!flowData) {
    return <InputScreen onDataLoaded={handleDataLoaded} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
            title="Back to Upload"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">EDAgent Visualizer</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">
                {flowData.funnel_name || 'Untitled Flow'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('flow')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'flow'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <GitBranch size={14} />
              Flow View
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'detailed'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <List size={14} />
              Detailed View
            </button>
          </div>
          <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-gray-500">
            {flowData.steps.length} Steps
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {viewMode === 'flow' ? (
          <>
            <FlowCanvas
              data={flowData}
              onNodeClick={setSelectedStep}
            />
            <DetailSidebar
              step={selectedStep}
              onClose={() => setSelectedStep(null)}
              pricingModel={flowData.pricing_model}
              questionnaires={flowData.questionnaires}
            />
          </>
        ) : (
          <DetailedView
            flowData={flowData}
            pricingModel={flowData.pricing_model}
            questionnaires={flowData.questionnaires}
          />
        )}
      </main>
    </div>
  );
}

export default App;
