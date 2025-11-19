import dagre from 'dagre';

const nodeWidth = 250;
const nodeHeight = 100;

export const transformJsonToFlow = (jsonData) => {
    if (!jsonData || !jsonData.steps) return { nodes: [], edges: [] };

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'TB' }); // Top-to-Bottom layout

    const nodes = [];
    const edges = [];

    // 1. Create Nodes
    jsonData.steps.forEach((step) => {
        const node = {
            id: step.step_id,
            type: 'custom', // We'll define a custom node type
            data: {
                label: step.step_name,
                type: step.step_type,
                details: step // Store full step data for the sidebar
            },
            position: { x: 0, y: 0 }, // Placeholder, Dagre will set this
        };
        nodes.push(node);
        dagreGraph.setNode(step.step_id, { width: nodeWidth, height: nodeHeight });
    });

    // 2. Create Edges
    jsonData.steps.forEach((step) => {
        // Handle simple next_steps
        if (step.next_steps && step.next_steps.length > 0) {
            step.next_steps.forEach((nextStepId) => {
                const edgeId = `${step.step_id}-${nextStepId}`;
                edges.push({
                    id: edgeId,
                    source: step.step_id,
                    target: nextStepId,
                    type: 'smoothstep',
                    animated: true,
                });
                dagreGraph.setEdge(step.step_id, nextStepId);
            });
        }

        // Handle branching_logic (if any additional ones not covered by next_steps)
        // The spec says branching_logic has "leads_to_step_id"
        if (step.branching_logic && step.branching_logic.length > 0) {
            step.branching_logic.forEach((branch, index) => {
                if (branch.leads_to_step_id) {
                    // Check if we already added this edge to avoid duplicates
                    const edgeId = `${step.step_id}-${branch.leads_to_step_id}-branch-${index}`;
                    const exists = edges.find(e => e.source === step.step_id && e.target === branch.leads_to_step_id);

                    if (!exists) {
                        edges.push({
                            id: edgeId,
                            source: step.step_id,
                            target: branch.leads_to_step_id,
                            type: 'smoothstep',
                            animated: true,
                            label: branch.condition || 'Branch', // Show condition on edge
                            style: { stroke: '#f59e0b' } // Amber for branches
                        });
                        dagreGraph.setEdge(step.step_id, branch.leads_to_step_id);
                    }
                }
            });
        }
    });

    // 3. Calculate Layout
    dagre.layout(dagreGraph);

    // 4. Apply calculated positions
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};
