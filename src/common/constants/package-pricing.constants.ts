/**
 * Flat monthly price (PKR) per subscription package.
 *
 * NOTE: These are placeholder rates for revenue calculation. There is no
 * finalized pricing model yet (per-student vs flat-rate). Once decided,
 * this should move to a Super Admin-editable settings table instead of
 * being hardcoded here.
 */
export const PackageMonthlyPricePkr: Record<string, number> = {
  basic: 5000,
  advanced: 12000,
  premium: 25000,
};