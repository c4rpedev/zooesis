export const PLAN_CONFIG = {
    'free': {
      nameKey: 'planFreeName', // Uses translation keys from your locale files
      limit: 10
    },
    // Your Stripe Price ID for the Popular plan
    'price_1Q93ZRFDb5nnq6rJbMJRSsJk': {
      nameKey: 'planPopularName',
      limit: 90
    },
    // Your Stripe Price ID for the Professional plan
    'price_1QhdDUFDb5nnq6rJArbsooB5': {
      nameKey: 'planProfessionalName',
      limit: Infinity // Infinity means unlimited
    },
  };

  // Helper function to get plan details safely
export const getPlanDetails = (planId) => {
    // If a planId from user.profile isn't in PLAN_CONFIG (e.g. old/invalid),
    // default to a restrictive plan to be safe.
    return PLAN_CONFIG[planId] || { nameKey: 'unknownPlanNameKey', limit: 0 };
  };