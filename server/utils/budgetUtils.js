/**
 * Budget Utilities
 * 
 * Calculates budget breakdown for a trip based on destination,
 * number of days, and total budget.
 */

// Cost distribution ratios for different budget levels
const budgetProfiles = {
  budget: {
    hotel: 0.30,
    food: 0.25,
    travel: 0.20,
    activities: 0.15,
    miscellaneous: 0.10,
  },
  moderate: {
    hotel: 0.35,
    food: 0.22,
    travel: 0.18,
    activities: 0.17,
    miscellaneous: 0.08,
  },
  luxury: {
    hotel: 0.40,
    food: 0.20,
    travel: 0.15,
    activities: 0.18,
    miscellaneous: 0.07,
  },
};

/**
 * Calculate a detailed budget breakdown for a trip.
 * 
 * @param {number} totalBudget - Total trip budget in USD
 * @param {number} days - Number of trip days
 * @returns {object} Budget breakdown with per-day and total amounts
 */
function calculateBudgetBreakdown(totalBudget, days) {
  // Determine budget tier
  const perDayBudget = totalBudget / days;
  let tier = 'budget';
  if (perDayBudget > 200) tier = 'luxury';
  else if (perDayBudget > 80) tier = 'moderate';

  const ratios = budgetProfiles[tier];

  // Calculate amounts for each category
  const breakdown = {};
  for (const [category, ratio] of Object.entries(ratios)) {
    breakdown[category] = Math.round(totalBudget * ratio);
  }

  return {
    total: totalBudget,
    days,
    perDay: Math.round(perDayBudget),
    tier,
    breakdown,
    perDayBreakdown: {
      hotel: Math.round(breakdown.hotel / days),
      food: Math.round(breakdown.food / days),
      travel: Math.round(breakdown.travel / days),
      activities: Math.round(breakdown.activities / days),
      miscellaneous: Math.round(breakdown.miscellaneous / days),
    },
  };
}

module.exports = { calculateBudgetBreakdown };
