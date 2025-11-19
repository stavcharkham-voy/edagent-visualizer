import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import {
    LayoutTemplate,
    UserPlus,
    CreditCard,
    HelpCircle,
    CheckCircle,
    MousePointerClick
} from 'lucide-react';
import clsx from 'clsx';

const getIcon = (type) => {
    switch (type) {
        case 'landing_page': return <LayoutTemplate size={20} />;
        case 'registration': return <UserPlus size={20} />;
        case 'payment':
        case 'pricing_page': return <CreditCard size={20} />;
        case 'questionnaire': return <HelpCircle size={20} />;
        case 'subscription': return <CheckCircle size={20} />;
        default: return <MousePointerClick size={20} />;
    }
};

const getColorClass = (type) => {
    switch (type) {
        case 'landing_page': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        case 'registration':
        case 'questionnaire': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
        case 'payment':
        case 'pricing_page': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
        case 'subscription': return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
        default: return 'border-gray-400 bg-gray-50 dark:bg-gray-800';
    }
};

const CustomNode = ({ data, isConnectable }) => {
    const { label, type } = data;

    return (
        <div className={clsx(
            "w-[250px] rounded-lg border-2 shadow-md p-4 transition-all hover:shadow-lg bg-white dark:bg-gray-900",
            getColorClass(type)
        )}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!bg-gray-400" />

            <div className="flex items-center gap-3">
                <div className={clsx("p-2 rounded-full bg-white/50 dark:bg-black/20")}>
                    {getIcon(type)}
                </div>
                <div>
                    <div className="text-xs font-bold uppercase opacity-70 tracking-wider">{type.replace('_', ' ')}</div>
                    <div className="font-semibold text-sm line-clamp-2">{label}</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!bg-gray-400" />
        </div>
    );
};

export default memo(CustomNode);
