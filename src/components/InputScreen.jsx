import React, { useState } from 'react';
import { Upload, FileJson, ArrowRight, AlertCircle } from 'lucide-react';

const InputScreen = ({ onDataLoaded }) => {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState(null);

    const handleParse = () => {
        try {
            const parsed = JSON.parse(jsonText);
            if (!parsed.steps) throw new Error("JSON must contain a 'steps' array.");
            onDataLoaded(parsed);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (!parsed.steps) throw new Error("JSON must contain a 'steps' array.");
                onDataLoaded(parsed);
            } catch (e) {
                setError("Invalid JSON file: " + e.message);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-8 text-center border-b border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileJson size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">EDAgent Visualizer</h1>
                    <p className="text-gray-500 dark:text-gray-400">Visualize your customer product funnels instantly.</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Paste Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Paste JSON
                        </label>
                        <textarea
                            className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder='{ "funnel_id": "...", "steps": [...] }'
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-sm text-gray-400 font-medium">OR</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    {/* Upload Section */}
                    <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">JSON files only</p>
                            </div>
                            <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleParse}
                        disabled={!jsonText}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Visualize Flow <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputScreen;
