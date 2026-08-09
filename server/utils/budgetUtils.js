/**
 * Budget Utilities
 *
 * Calculates budget breakdown for a trip based on destination,
 * number of days, and total budget.
 */

const { resolveCostIndex } = require('./costOfLivingIndex');

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
 * The tier ($/day -> budget/moderate/luxury) is judged against the
 * destination's relative cost of living, not a flat dollar threshold —
 * $100/day is luxury-tier spending in a low-cost destination and tight in
 * an expensive one, so the same nominal budget should not always produce
 * an identical breakdown. The actual dollar amounts returned still add up
 * to the user's real `totalBudget`; only the tier/ratio selection shifts.
 *
 * @param {number} totalBudget - Total trip budget in USD
 * @param {number} days - Number of trip days
 * @param {string} [destination] - Used to look up a relative cost index
 * @returns {object} Budget breakdown with per-day and total amounts
 */
function calculateBudgetBreakdown(totalBudget, days, destination) {
  // Determine budget tier, adjusted for the destination's relative cost
  const perDayBudget = totalBudget / days;
  const costIndex = resolveCostIndex(destination);
  const effectivePerDay = perDayBudget / costIndex;

  let tier = 'budget';
  if (effectivePerDay > 200) tier = 'luxury';
  else if (effectivePerDay > 80) tier = 'moderate';

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
    costIndex,
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
