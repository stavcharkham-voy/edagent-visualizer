import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { transformJsonToFlow } from '../utils/transformData';

const nodeTypes = {
    custom: CustomNode,
};

const FlowCanvas = ({ data, onNodeClick }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (data) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = transformJsonToFlow(data);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [data, setNodes, setEdges]);

    return (
        <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(_, node) => onNodeClick(node.data.details)}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                nodesDraggable={false}
                nodesConnectable={false}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { strokeWidth: 2, stroke: '#94a3b8' },
                    animated: true,
                }}
            >
                <Background color="#94a3b8" gap={16} size={1} />
                <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 fill-gray-600 dark:fill-gray-300" />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
