/**
 * Gets steps in their sequential order based on next_steps relationships
 * Returns a flat array of steps in order
 */
export const getOrderedSteps = (steps) => {
  if (!steps || steps.length === 0) return [];

  // Create a map for quick step lookup
  const stepMap = new Map(steps.map(step => [step.step_id, step]));

  // Find root steps (no parent_step_id or parent not in steps)
  const rootSteps = steps.filter(step => {
    if (!step.parent_step_id) return true;
    return !stepMap.has(step.parent_step_id);
  });

  // If no clear root, use first step
  if (rootSteps.length === 0 && steps.length > 0) {
    return steps; // Return as-is if we can't determine order
  }

  // Build ordered list starting from roots
  const ordered = [];
  const visited = new Set();

  const addStep = (step) => {
    if (!step || visited.has(step.step_id)) return;
    
    visited.add(step.step_id);
    ordered.push(step);

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

  // Add any remaining steps that weren't visited
  steps.forEach(step => {
    if (!visited.has(step.step_id)) {
      ordered.push(step);
    }
  });

  return ordered;
};

