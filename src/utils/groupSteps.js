/**
 * Groups steps by both step type and sequential flow relationships
 * Returns an array of groups, where each group contains related steps
 */
export const groupSteps = (steps) => {
  if (!steps || steps.length === 0) return [];

  // Create a map for quick step lookup
  const stepMap = new Map(steps.map(step => [step.step_id, step]));

  // Group by step type first
  const typeGroups = new Map();
  steps.forEach(step => {
    const type = step.step_type || 'other';
    if (!typeGroups.has(type)) {
      typeGroups.set(type, []);
    }
    typeGroups.get(type).push(step);
  });

  // Now organize by sequential flow within each type group
  const finalGroups = [];

  typeGroups.forEach((typeSteps, type) => {
    // Find root steps (no parent or parent not in this type group)
    const rootSteps = typeSteps.filter(step => {
      if (!step.parent_step_id) return true;
      const parent = stepMap.get(step.parent_step_id);
      return !parent || parent.step_type !== type;
    });

    // For each root, build its sequential chain
    rootSteps.forEach(rootStep => {
      const chain = [];
      let current = rootStep;
      
      while (current) {
        chain.push(current);
        // Find next step in the same type group
        const nextStepId = current.next_steps?.[0];
        if (nextStepId) {
          const nextStep = typeSteps.find(s => s.step_id === nextStepId);
          current = nextStep || null;
        } else {
          current = null;
        }
      }

      if (chain.length > 0) {
        finalGroups.push({
          type,
          steps: chain,
          title: getGroupTitle(type, chain)
        });
      }
    });

    // Handle orphaned steps (not in any chain)
    const chainedStepIds = new Set();
    finalGroups.forEach(group => {
      if (group.type === type) {
        group.steps.forEach(step => chainedStepIds.add(step.step_id));
      }
    });

    const orphaned = typeSteps.filter(step => !chainedStepIds.has(step.step_id));
    if (orphaned.length > 0) {
      orphaned.forEach(step => {
        finalGroups.push({
          type,
          steps: [step],
          title: getGroupTitle(type, [step])
        });
      });
    }
  });

  // Sort groups by the first step's position in the original flow
  const stepOrder = new Map(steps.map((step, index) => [step.step_id, index]));
  finalGroups.sort((a, b) => {
    const aOrder = stepOrder.get(a.steps[0].step_id) || 0;
    const bOrder = stepOrder.get(b.steps[0].step_id) || 0;
    return aOrder - bOrder;
  });

  return finalGroups;
};

const getGroupTitle = (type, steps) => {
  const typeLabels = {
    landing_page: 'Landing',
    registration: 'Registration',
    questionnaire: 'Onboarding',
    payment: 'Payment',
    pricing_page: 'Pricing',
    subscription: 'Subscription',
    other: 'Other Steps'
  };

  const baseTitle = typeLabels[type] || type.replace('_', ' ');
  
  if (steps.length === 1) {
    return `${baseTitle}: ${steps[0].step_name}`;
  }
  
  return `${baseTitle} Flow (${steps.length} steps)`;
};



