/**
 * Detects branching paths in the funnel and organizes steps into visual paths
 * Returns an array of path objects, each containing steps in order
 * For now, returns a simple structure - can be enhanced for complex branching
 */
export const detectFunnelPaths = (steps) => {
  if (!steps || steps.length === 0) return [];

  const stepMap = new Map(steps.map(step => [step.step_id, step]));
  
  // Find root steps (no parent or parent not in steps)
  const rootSteps = steps.filter(step => {
    if (!step.parent_step_id) return true;
    return !stepMap.has(step.parent_step_id);
  });

  // For now, return single path using getOrderedSteps logic
  // This can be enhanced later to detect actual parallel paths
  // The visual design will handle showing paths side-by-side when needed
  
  const orderedSteps = [];
  const visited = new Set();

  const addStep = (step) => {
    if (!step || visited.has(step.step_id)) return;
    
    visited.add(step.step_id);
    orderedSteps.push(step);

    // Add next steps
    if (step.next_steps && step.next_steps.length > 0) {
      step.next_steps.forEach(nextStepId => {
        const nextStep = stepMap.get(nextStepId);
        if (nextStep) {
          addStep(nextStep);
        }
      });
    }
  };

  // Start from root steps
  rootSteps.forEach(root => addStep(root));

  // Add any remaining steps
  steps.forEach(step => {
    if (!visited.has(step.step_id)) {
      orderedSteps.push(step);
    }
  });

  // Return as single path for now
  // The component will handle visual layout
  return [{
    type: 'main',
    steps: orderedSteps
  }];
};

