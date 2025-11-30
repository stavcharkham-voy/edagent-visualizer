import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, DollarSign, Plus, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import clsx from 'clsx';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const EditableAmount = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toLocaleString() || '');

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(editValue.replace(/,/g, ''));
    if (!isNaN(numValue) && numValue >= 0) {
      onSave(numValue);
    } else {
      setEditValue(value?.toLocaleString() || '');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value?.toLocaleString() || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-32 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
      ${value?.toLocaleString() || '0'}
    </span>
  );
};

const SpendSection = ({ adSpend, onAdSpendUpdate, onAddChannel, onRemoveChannel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  const [highlightedChannel, setHighlightedChannel] = useState(null);
  const [newChannel, setNewChannel] = useState({ channel: '', amount: '', type: '' });
  const [isAdding, setIsAdding] = useState(false);

  const monthlySpend = useMemo(() => {
    return adSpend?.monthly || [];
  }, [adSpend]);

  const spendData = useMemo(() => {
    const multiplier = period === 'yearly' ? 12 : 1;
    return adSpend?.monthly?.map(item => ({
      ...item,
      amount: item.amount * multiplier
    })) || [];
  }, [adSpend, period]);

  const totalSpend = useMemo(() => {
    return spendData.reduce((sum, item) => sum + item.amount, 0);
  }, [spendData]);

  const chartData = spendData.map((item, index) => ({
    name: item.channel,
    value: item.amount,
    color: COLORS[index % COLORS.length]
  }));

  const handleAmountUpdate = (channelId, newAmount) => {
    if (onAdSpendUpdate) {
      const multiplier = period === 'yearly' ? 12 : 1;
      onAdSpendUpdate(channelId, newAmount / multiplier);
    }
  };

  const handleAddChannel = () => {
    if (newChannel.channel && newChannel.amount) {
      const amount = parseFloat(newChannel.amount.replace(/,/g, ''));
      if (!isNaN(amount) && amount >= 0) {
        onAddChannel({
          channel: newChannel.channel,
          amount: amount,
          type: newChannel.type || 'Other'
        });
        setNewChannel({ channel: '', amount: '', type: '' });
        setIsAdding(false);
      }
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

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
          <DollarSign size={18} className="text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Spend
          </h2>
        </div>
      </button>

      {/* Collapsed Preview - Channel List */}
      {!isOpen && (
        <div className="px-6 pb-6 space-y-2">
          {monthlySpend.map((item) => (
            <div key={item.id} className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{item.channel}:</span>{' '}
              <span className="text-gray-900 dark:text-white">${item.amount.toLocaleString()}</span>
            </div>
          ))}
          {monthlySpend.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">No spend data available</div>
          )}
        </div>
      )}

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-6 pt-0">
          {/* Period Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setPeriod('monthly')}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                period === 'monthly'
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                period === 'yearly'
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              Yearly
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table */}
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Channel</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendData.map((item) => (
                      <tr
                        key={item.id}
                        className={clsx(
                          "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                          highlightedChannel === item.id && "bg-blue-50 dark:bg-blue-900/20"
                        )}
                        onMouseEnter={() => setHighlightedChannel(item.id)}
                        onMouseLeave={() => setHighlightedChannel(null)}
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{item.channel}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <EditableAmount
                            value={item.amount}
                            onSave={(newAmount) => handleAmountUpdate(item.id, newAmount)}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.type}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onRemoveChannel(item.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-600 dark:text-red-400"
                            title="Remove channel"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Channel */}
              {isAdding ? (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <input
                    type="text"
                    placeholder="Channel name"
                    value={newChannel.channel}
                    onChange={(e) => setNewChannel({ ...newChannel, channel: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Amount"
                    value={newChannel.amount}
                    onChange={(e) => setNewChannel({ ...newChannel, amount: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Type (optional)"
                    value={newChannel.type}
                    onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddChannel}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewChannel({ channel: '', amount: '', type: '' });
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Channel
                </button>
              )}

              {/* Total Spend */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Spend</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${totalSpend.toLocaleString()} {period === 'monthly' ? 'Per month' : 'Per year'}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={(data, index) => {
                        const channel = spendData[index];
                        if (channel) setHighlightedChannel(channel.id);
                      }}
                      onMouseLeave={() => setHighlightedChannel(null)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendSection;

